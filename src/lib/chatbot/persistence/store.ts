/**
 * Chat conversation / message persistence against MongoDB Atlas.
 */

import type { LeadSession } from "@/lib/chatbot/lead";
import { getChatDb } from "@/lib/chatbot/persistence/client";
import { generateConversationTitle } from "@/lib/chatbot/persistence/titles";
import type {
  ConversationDetail,
  ConversationSummary,
  StoredChatMessage,
  StoredChatRole,
  StoredConversation,
} from "@/lib/chatbot/persistence/types";
import type { ChatSource } from "@/lib/chatbot/types";
import { CHAT_LIMITS } from "@/lib/chatbot/types";

function toIso(value: Date) {
  return value.toISOString();
}

export async function getOwnedConversation(
  conversationId: string,
  sessionId: string,
): Promise<StoredConversation | null> {
  const db = await getChatDb();
  return db.collection<StoredConversation>("conversations").findOne({
    _id: conversationId,
    sessionId,
  });
}

export async function ensureConversation(input: {
  conversationId?: string;
  sessionId: string;
  firstUserMessage: string;
  lead?: LeadSession;
}): Promise<StoredConversation> {
  const db = await getChatDb();
  const conversations = db.collection<StoredConversation>("conversations");
  const now = new Date();

  if (input.conversationId) {
    const existing = await conversations.findOne({
      _id: input.conversationId,
      sessionId: input.sessionId,
    });
    if (existing) {
      if (existing.title === "New conversation" && input.firstUserMessage.trim()) {
        const title = generateConversationTitle(input.firstUserMessage);
        await conversations.updateOne(
          { _id: existing._id },
          { $set: { title, updatedAt: now } },
        );
        return { ...existing, title, updatedAt: now };
      }
      return existing;
    }
  }

  const conversation: StoredConversation = {
    _id: input.conversationId || crypto.randomUUID(),
    sessionId: input.sessionId,
    userId: null,
    title: generateConversationTitle(input.firstUserMessage),
    lead: input.lead,
    createdAt: now,
    updatedAt: now,
  };

  await conversations.insertOne(conversation);
  return conversation;
}

export async function updateConversationMeta(input: {
  conversationId: string;
  sessionId: string;
  lead?: LeadSession;
  titleIfEmpty?: string;
}) {
  const db = await getChatDb();
  const $set: Partial<StoredConversation> = {
    updatedAt: new Date(),
  };
  if (input.lead) $set.lead = input.lead;

  await db.collection<StoredConversation>("conversations").updateOne(
    { _id: input.conversationId, sessionId: input.sessionId },
    { $set },
  );
}

export async function appendMessage(input: {
  conversationId: string;
  role: StoredChatRole;
  content: string;
  sources?: ChatSource[];
  createdAt?: Date;
}): Promise<StoredChatMessage> {
  const db = await getChatDb();
  const message: StoredChatMessage = {
    _id: crypto.randomUUID(),
    conversationId: input.conversationId,
    role: input.role,
    content: input.content,
    sources: input.sources,
    createdAt: input.createdAt ?? new Date(),
  };

  await db.collection<StoredChatMessage>("messages").insertOne(message);
  await db.collection<StoredConversation>("conversations").updateOne(
    { _id: input.conversationId },
    { $set: { updatedAt: message.createdAt } },
  );

  return message;
}

export async function listRecentMessagesForLlm(
  conversationId: string,
  limit = CHAT_LIMITS.history.maxMessages,
): Promise<Array<{ role: StoredChatRole; content: string }>> {
  const db = await getChatDb();
  const rows = await db
    .collection<StoredChatMessage>("messages")
    .find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return rows
    .reverse()
    .map((row) => ({
      role: row.role,
      content: row.content,
    }));
}

export async function listConversationsForSession(
  sessionId: string,
  limit = 20,
): Promise<ConversationSummary[]> {
  const db = await getChatDb();
  const rows = await db
    .collection<StoredConversation>("conversations")
    .find({ sessionId })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .project({ title: 1, updatedAt: 1 })
    .toArray();

  return rows.map((row) => ({
    id: row._id,
    title: row.title || "Conversation",
    updatedAt: toIso(row.updatedAt),
  }));
}

export async function getConversationDetail(
  conversationId: string,
  sessionId: string,
): Promise<ConversationDetail | null> {
  const conversation = await getOwnedConversation(conversationId, sessionId);
  if (!conversation) return null;

  const db = await getChatDb();
  const messages = await db
    .collection<StoredChatMessage>("messages")
    .find({ conversationId })
    .sort({ createdAt: 1 })
    .toArray();

  return {
    id: conversation._id,
    title: conversation.title,
    updatedAt: toIso(conversation.updatedAt),
    messages: messages.map((message) => ({
      id: message._id,
      role: message.role,
      content: message.content,
      createdAt: toIso(message.createdAt),
      sources: message.sources,
    })),
  };
}

export async function createEmptyConversation(sessionId: string) {
  const db = await getChatDb();
  const now = new Date();
  const conversation: StoredConversation = {
    _id: crypto.randomUUID(),
    sessionId,
    userId: null,
    title: "New conversation",
    createdAt: now,
    updatedAt: now,
  };
  await db.collection<StoredConversation>("conversations").insertOne(conversation);
  return conversation;
}
