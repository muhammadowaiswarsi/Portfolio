import { getAIProvider, type AIChatMessage } from "@/lib/chatbot/ai";
import { AINotConfiguredError, AIProviderError } from "@/lib/chatbot/ai";
import { CHAT_SYSTEM_PROMPT, USER_FACING_CHAT_ERROR } from "@/lib/chatbot/config";
import { retrieveChatKnowledge } from "@/lib/chatbot/knowledge";
import {
  applyLeadTurn,
  createLeadSession,
  formatLeadConfirmation,
  formatLeadContext,
  markLeadFailed,
  markLeadSubmitted,
  missingLeadFields,
  toContactPayload,
  type LeadSession,
} from "@/lib/chatbot/lead";
import {
  appendMessage,
  ensureConversation,
  getOwnedConversation,
  isChatPersistenceConfigured,
  listRecentMessagesForLlm,
  updateConversationMeta,
} from "@/lib/chatbot/persistence";
import type { ParsedChatRequest } from "@/lib/chatbot/request";
import type {
  ChatHistoryItem,
  ChatLeadMetadata,
  ChatMessage,
  ChatResponse,
  ChatSource,
} from "@/lib/chatbot/types";
import { CHAT_LIMITS } from "@/lib/chatbot/types";
import { sendContactInquiry } from "@/lib/contact-send";
import { isOffTopicMessage, OFF_TOPIC_REPLY } from "@/lib/chatbot/scope";

type ConversationRecord = {
  messages: AIChatMessage[];
  updatedAt: number;
  lead: LeadSession;
};

const conversations = new Map<string, ConversationRecord>();
const CONVERSATION_TTL_MS = 30 * 60 * 1000;
const MAX_CONVERSATIONS = 200;
const MAX_LEAD_SUBMITS = 3;

const LEAD_SUCCESS =
  "Thanks! I've sent your project details to the Computing Yard team. They'll be able to review your requirements and get back to you.";
const LEAD_FAILED =
  "I couldn't submit the request right now. You can also contact the Computing Yard team directly through the Contact page: /contact";
const LEAD_CANCELLED =
  "No problem — I won't send anything. You can keep chatting, or visit /contact if you'd like to reach the team later.";
const LEAD_REJECTED =
  "Understood. I won't send those details. If you change your mind, just say you'd like to start a project.";
const LEAD_DUPLICATE =
  "I've already sent those details to the Computing Yard team. You can add more through /contact if needed.";

export class ChatServiceError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ChatServiceError";
    this.status = status;
  }
}

export type CreateChatReplyOptions = {
  /** Mongo chat session id (ownership). */
  sessionId?: string;
};

function createId() {
  return crypto.randomUUID();
}

function pruneConversations(now = Date.now()) {
  for (const [id, record] of conversations) {
    if (now - record.updatedAt > CONVERSATION_TTL_MS) {
      conversations.delete(id);
    }
  }

  if (conversations.size <= MAX_CONVERSATIONS) return;

  const oldest = [...conversations.entries()].sort(
    (a, b) => a[1].updatedAt - b[1].updatedAt,
  );

  for (const [id] of oldest.slice(0, conversations.size - MAX_CONVERSATIONS)) {
    conversations.delete(id);
  }
}

function isConversationRole(
  role: string,
): role is "user" | "assistant" {
  return role === "user" || role === "assistant";
}

function asConversationMessages(messages: AIChatMessage[]): AIChatMessage[] {
  return messages.filter((message) => isConversationRole(message.role));
}

function withoutCurrentTurn(
  history: AIChatMessage[],
  message: string,
): AIChatMessage[] {
  if (history.length === 0) return history;

  const last = history[history.length - 1];
  if (last && last.role === "user" && last.content === message) {
    return history.slice(0, -1);
  }

  return history;
}

function historyFromRequest(history: ChatHistoryItem[]): AIChatMessage[] {
  return history
    .filter((item) => isConversationRole(item.role))
    .map((item) => ({
      role: item.role,
      content: item.content,
    }));
}

function needsFollowUpContext(message: string) {
  const value = message.trim().toLowerCase();
  if (!value) return false;
  if (/^(hi|hello|hey|howdy|thanks|thank you|good morning|good afternoon|good evening|yo)[\s!.?]*$/.test(value)) {
    return false;
  }

  return (
    /\b(it|that|this|those|them|they|there|same|also|first|second|third|one)\b/.test(value) ||
    /^(and|what about|how about|for (it|that|this)|which one|tell me more)\b/.test(value)
  );
}

function knowledgeSearchQuery(message: string, history: AIChatMessage[]) {
  if (!needsFollowUpContext(message)) return message;

  const previousUser = [...history]
    .reverse()
    .find((item) => item.role === "user");

  if (!previousUser) return message;

  return `${previousUser.content}\n${message}`;
}

function toAssistantMessage(
  content: string,
  sources: ChatSource[] = [],
): ChatMessage {
  return {
    id: createId(),
    role: "assistant",
    content,
    createdAt: new Date().toISOString(),
    sources: sources.length > 0 ? sources : undefined,
  };
}

function leadMetadata(session: LeadSession): ChatLeadMetadata {
  const inLead = session.phase !== "idle" && session.phase !== "submitted";

  return {
    phase: session.phase,
    missing: missingLeadFields(session.data),
    showCta: session.phase === "idle",
    messageType: inLead || session.phase === "submitted" ? "lead" : "info",
  };
}

async function resolveLeadReply(
  session: LeadSession,
  action: ReturnType<typeof applyLeadTurn>["action"],
): Promise<{ session: LeadSession; content?: string }> {
  if (action === "confirm_prompt") {
    return { session, content: formatLeadConfirmation(session.data) };
  }

  if (action === "cancelled") {
    return { session, content: LEAD_CANCELLED };
  }

  if (action === "rejected") {
    return { session, content: LEAD_REJECTED };
  }

  if (action === "duplicate") {
    return { session, content: LEAD_DUPLICATE };
  }

  if (action !== "submit") {
    return { session };
  }

  if (session.submitCount >= MAX_LEAD_SUBMITS) {
    return { session: markLeadSubmitted(session), content: LEAD_DUPLICATE };
  }

  const payload = toContactPayload(session.data);
  if (!payload) {
    return {
      session: { ...session, phase: "collecting" },
    };
  }

  const sent = await sendContactInquiry(payload);
  if (!sent.ok) {
    return { session: markLeadFailed(session), content: LEAD_FAILED };
  }

  return { session: markLeadSubmitted(session), content: LEAD_SUCCESS };
}

async function loadPersistedContext(input: {
  sessionId: string;
  conversationId?: string;
  message: string;
}): Promise<{
  conversationId: string;
  priorMessages: AIChatMessage[];
  lead: LeadSession;
  persistenceReady: boolean;
}> {
  if (!isChatPersistenceConfigured()) {
    return {
      conversationId: input.conversationId ?? createId(),
      priorMessages: [],
      lead: createLeadSession(),
      persistenceReady: false,
    };
  }

  try {
    let conversationId = input.conversationId;
    let lead = createLeadSession();

    if (conversationId) {
      const owned = await getOwnedConversation(conversationId, input.sessionId);
      if (!owned) {
        // Do not reveal that the ID belongs to someone else — start a new conversation.
        conversationId = undefined;
      } else if (owned.lead) {
        lead = owned.lead;
      }
    }

    const conversation = await ensureConversation({
      conversationId,
      sessionId: input.sessionId,
      firstUserMessage: input.message,
      lead,
    });

    const recent = await listRecentMessagesForLlm(
      conversation._id,
      CHAT_LIMITS.history.maxMessages,
    );

    return {
      conversationId: conversation._id,
      priorMessages: recent.map((row) => ({
        role: row.role,
        content: row.content,
      })),
      lead: conversation.lead ?? lead,
      persistenceReady: true,
    };
  } catch (error) {
    console.error("Chat persistence load failed.", {
      code:
        error && typeof error === "object" && "code" in error
          ? String((error as { code?: unknown }).code)
          : "LOAD_FAILED",
    });
    return {
      conversationId: input.conversationId ?? createId(),
      priorMessages: [],
      lead: createLeadSession(),
      persistenceReady: false,
    };
  }
}

async function persistTurn(input: {
  persistenceReady: boolean;
  sessionId?: string;
  conversationId: string;
  userContent: string;
  assistant: ChatMessage;
  lead: LeadSession;
}): Promise<boolean> {
  if (!input.persistenceReady || !input.sessionId) return false;
  if (!isChatPersistenceConfigured()) return false;

  try {
    await appendMessage({
      conversationId: input.conversationId,
      role: "user",
      content: input.userContent,
    });
    await appendMessage({
      conversationId: input.conversationId,
      role: "assistant",
      content: input.assistant.content,
      sources: input.assistant.sources,
    });
    await updateConversationMeta({
      conversationId: input.conversationId,
      sessionId: input.sessionId,
      lead: input.lead,
    });
    return true;
  } catch (error) {
    console.error("Chat persistence save failed.", {
      code:
        error && typeof error === "object" && "code" in error
          ? String((error as { code?: unknown }).code)
          : "SAVE_FAILED",
      message: error instanceof Error ? error.message : "unknown",
    });
    return false;
  }
}

export async function createChatReply(
  request: ParsedChatRequest,
  options: CreateChatReplyOptions = {},
): Promise<ChatResponse> {
  pruneConversations();

  const sessionId = options.sessionId;
  let conversationId = request.conversationId ?? createId();
  let lead = createLeadSession();
  let persistenceReady = false;
  let priorMessages: AIChatMessage[] = [];

  if (sessionId && isChatPersistenceConfigured()) {
    const loaded = await loadPersistedContext({
      sessionId,
      conversationId: request.conversationId,
      message: request.message,
    });
    conversationId = loaded.conversationId;
    lead = loaded.lead;
    persistenceReady = loaded.persistenceReady;
    priorMessages = withoutCurrentTurn(
      asConversationMessages(loaded.priorMessages),
      request.message,
    ).slice(-CHAT_LIMITS.history.maxMessages);
  }

  if (priorMessages.length === 0) {
    const stored = conversations.get(conversationId);
    priorMessages = withoutCurrentTurn(
      asConversationMessages(
        stored?.messages ?? historyFromRequest(request.history),
      ),
      request.message,
    ).slice(-CHAT_LIMITS.history.maxMessages);
    if (stored?.lead) lead = stored.lead;
  }

  if (isOffTopicMessage(request.message)) {
    const assistantMessage = toAssistantMessage(OFF_TOPIC_REPLY);
    const history: AIChatMessage[] = [
      ...priorMessages,
      { role: "user", content: request.message },
      { role: "assistant", content: OFF_TOPIC_REPLY },
    ];

    conversations.set(conversationId, {
      messages: history.slice(-CHAT_LIMITS.history.maxMessages),
      updatedAt: Date.now(),
      lead,
    });

    const persisted = await persistTurn({
      persistenceReady,
      sessionId,
      conversationId,
      userContent: request.message,
      assistant: assistantMessage,
      lead,
    });

    return {
      message: assistantMessage,
      conversationId,
      metadata: {
        channel: request.channel,
        lead: leadMetadata(lead),
        persisted,
        retrieval: {
          mode: "hybrid",
          rerankerUsed: false,
          sourceCount: 0,
          success: true,
          fallbackUsed: false,
        },
      },
    };
  }

  const leadTurn = applyLeadTurn(lead, request.message);
  const resolved = await resolveLeadReply(leadTurn.session, leadTurn.action);
  lead = resolved.session;
  let assistantContent = resolved.content;
  let sources: ChatSource[] = [];
  let model: string | undefined;
  let retrievalMeta:
    | {
        mode: "hybrid" | "sanity_fallback";
        rerankerUsed: boolean;
        sourceCount: number;
        success: boolean;
        fallbackUsed: boolean;
      }
    | undefined;

  if (!assistantContent) {
    const knowledge = await retrieveChatKnowledge(
      knowledgeSearchQuery(request.message, priorMessages),
    );

    sources = knowledge.sources;
    retrievalMeta = {
      mode: knowledge.diagnostics.mode,
      rerankerUsed: knowledge.diagnostics.rerankerUsed,
      sourceCount: knowledge.diagnostics.sourceCount,
      success: knowledge.diagnostics.success,
      fallbackUsed: knowledge.diagnostics.fallbackUsed,
    };

    const messages: AIChatMessage[] = [
      {
        role: "system",
        content: `${CHAT_SYSTEM_PROMPT}${knowledge.contextBlock}${formatLeadContext(lead)}`,
      },
      ...priorMessages,
      {
        role: "user",
        content: request.message,
      },
    ];

    try {
      const ai = getAIProvider();
      const generated = await ai.generateResponse({ messages });
      assistantContent = generated.content;
      model = generated.model;
    } catch (error) {
      if (error instanceof AINotConfiguredError) {
        throw new ChatServiceError(error.message, error.status);
      }

      if (error instanceof AIProviderError) {
        throw new ChatServiceError(
          error.message || USER_FACING_CHAT_ERROR,
          error.status,
        );
      }

      throw new ChatServiceError(USER_FACING_CHAT_ERROR, 500);
    }
  }

  const assistantMessage = toAssistantMessage(assistantContent, sources);
  const history: AIChatMessage[] = [
    ...priorMessages,
    { role: "user", content: request.message },
    { role: "assistant", content: assistantContent },
  ];

  conversations.set(conversationId, {
    messages: history.slice(-CHAT_LIMITS.history.maxMessages),
    updatedAt: Date.now(),
    lead,
  });

  const persisted = await persistTurn({
    persistenceReady,
    sessionId,
    conversationId,
    userContent: request.message,
    assistant: assistantMessage,
    lead,
  });

  return {
    message: assistantMessage,
    conversationId,
    metadata: {
      model,
      channel: request.channel,
      sources: sources.length > 0 ? sources : undefined,
      lead: leadMetadata(lead),
      persisted,
      retrieval: retrievalMeta,
    },
  };
}
