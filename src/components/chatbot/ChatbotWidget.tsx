"use client";

import { MessageCircle } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import type { ChatConversationListItem } from "@/components/chatbot/ChatHistoryPanel";
import { ChatWindow } from "@/components/chatbot/ChatWindow";
import { cn } from "@/lib/cn";
import { CHAT_LEAD_PROMPT, USER_FACING_CHAT_ERROR } from "@/lib/chatbot/ui";
import {
  CHAT_LIMITS,
  type ChatHistoryItem,
  type ChatLeadMetadata,
  type ChatLeadPhase,
  type ChatMessage,
  type ChatSource,
} from "@/lib/chatbot/types";
import { MIXPANEL_EVENTS, track } from "@/lib/mixpanel";

const STORAGE_KEY = "cy-chat-conversation-id";
const LEAD_PHASES: ChatLeadPhase[] = [
  "idle",
  "lead_detected",
  "collecting",
  "confirmation",
  "submitting",
  "submitted",
  "failed",
];

type ChatApiSuccess = {
  ok: true;
  message: ChatMessage;
  conversationId: string;
  metadata?: {
    sources?: ChatSource[];
    lead?: ChatLeadMetadata;
    persisted?: boolean;
    retrieval?: {
      mode?: "hybrid" | "sanity_fallback";
      rerankerUsed?: boolean;
      sourceCount?: number;
      success?: boolean;
      fallbackUsed?: boolean;
    };
  };
};

type ChatApiError = {
  ok: false;
  error?: string;
};

function clientError(value: unknown) {
  if (typeof value !== "string") return USER_FACING_CHAT_ERROR;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 180) return USER_FACING_CHAT_ERROR;
  return trimmed;
}

function isChatSource(value: unknown): value is ChatSource {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    typeof row.title === "string" &&
    typeof row.type === "string"
  );
}

function parseSources(value: unknown): ChatSource[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const sources = value.filter(isChatSource);
  return sources.length > 0 ? sources : undefined;
}

function parseLeadMetadata(value: unknown): ChatLeadMetadata | undefined {
  if (!value || typeof value !== "object") return undefined;
  const row = value as Record<string, unknown>;
  if (typeof row.phase !== "string") return undefined;
  if (!LEAD_PHASES.includes(row.phase as ChatLeadPhase)) return undefined;

  return {
    phase: row.phase as ChatLeadPhase,
    missing: [],
    showCta: row.showCta === true,
    messageType: row.messageType === "lead" ? "lead" : "info",
  };
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    (row.role === "user" || row.role === "assistant") &&
    typeof row.content === "string" &&
    typeof row.createdAt === "string"
  );
}

function createLocalMessage(role: "user" | "assistant", content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

function toHistory(messages: ChatMessage[]): ChatHistoryItem[] {
  const history: ChatHistoryItem[] = [];

  for (const message of messages) {
    if (message.role !== "user" && message.role !== "assistant") continue;
    history.push({ role: message.role, content: message.content });
  }

  return history.slice(-CHAT_LIMITS.history.maxMessages);
}

function readStoredConversationId() {
  if (typeof window === "undefined") return undefined;
  try {
    return (
      window.localStorage.getItem(STORAGE_KEY) ??
      window.sessionStorage.getItem(STORAGE_KEY) ??
      undefined
    );
  } catch {
    return undefined;
  }
}

function writeStoredConversationId(id: string | undefined) {
  try {
    if (!id) {
      window.localStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Ignore storage failures.
  }
}

function trackLeadTransition(previous: ChatLeadPhase, next: ChatLeadPhase) {
  const started =
    (previous === "idle" || previous === "submitted") &&
    (next === "lead_detected" || next === "collecting" || next === "confirmation");

  if (started) {
    track(MIXPANEL_EVENTS.CHATBOT_LEAD_STARTED);
  }

  if (next === "submitted" && previous !== "submitted") {
    track(MIXPANEL_EVENTS.CHATBOT_LEAD_SUBMITTED);
  }

  if (next === "failed" && previous !== "failed") {
    track(MIXPANEL_EVENTS.CHATBOT_LEAD_SUBMISSION_FAILED);
  }
}

export function ChatbotWidget() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLeadCta, setShowLeadCta] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(() =>
    readStoredConversationId(),
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyLoadError, setHistoryLoadError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ChatConversationListItem[]>([]);
  const [restoring, setRestoring] = useState(false);
  const [persistenceEnabled, setPersistenceEnabled] = useState(true);
  const leadPhaseRef = useRef<ChatLeadPhase>("idle");
  const ctaUsedRef = useRef(false);
  const restoreAttemptKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const loadConversationList = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryLoadError(null);
    try {
      const response = await fetch("/api/chat/conversations", {
        method: "GET",
        credentials: "same-origin",
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok: true; conversations: ChatConversationListItem[] }
        | ChatApiError
        | null;

      if (!response.ok || !payload || payload.ok !== true) {
        setConversations([]);
        if (response.status === 503) {
          setPersistenceEnabled(false);
          setHistoryLoadError(
            "Chat history is unavailable right now. Messages still work in this session.",
          );
        } else {
          setHistoryLoadError("Unable to load conversations right now.");
        }
        return;
      }

      setPersistenceEnabled(true);
      setConversations(payload.conversations);
    } catch {
      setConversations([]);
      setHistoryLoadError("Unable to load conversations right now.");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const restoreConversation = useCallback(async (id: string) => {
    setRestoring(true);
    setError(null);
    setMessages([]);
    try {
      const response = await fetch(`/api/chat/conversations/${id}`, {
        method: "GET",
        credentials: "same-origin",
      });
      const payload = (await response.json().catch(() => null)) as
        | {
            ok: true;
            conversation: {
              id: string;
              messages: ChatMessage[];
            };
          }
        | ChatApiError
        | null;

      if (!response.ok || !payload || payload.ok !== true) {
        writeStoredConversationId(undefined);
        setConversationId(undefined);
        setMessages([]);
        restoreAttemptKeyRef.current = null;
        if (response.status === 404) {
          // Stale local id / other session — quiet reset.
          return;
        }
        if (response.status === 503) {
          setPersistenceEnabled(false);
          setError(
            "Chat history is unavailable right now. You can continue in a new chat.",
          );
          return;
        }
        setError("Unable to restore the previous conversation. You can start a new one.");
        return;
      }

      const restored = payload.conversation.messages
        .filter((message) => message.role === "user" || message.role === "assistant")
        .map((message) => ({
          ...message,
          sources: parseSources(message.sources),
        }));

      setPersistenceEnabled(true);
      setConversationId(payload.conversation.id);
      writeStoredConversationId(payload.conversation.id);
      setMessages(restored);
      leadPhaseRef.current = "idle";
      setShowLeadCta(false);
    } catch {
      restoreAttemptKeyRef.current = null;
      setError("Unable to restore the previous conversation. You can start a new one.");
    } finally {
      setRestoring(false);
    }
  }, []);

  const openChat = useCallback(() => {
    setOpen(true);
    track(MIXPANEL_EVENTS.CHATBOT_OPENED, {
      path: window.location.pathname,
    });

    // Restore from the server whenever the transcript is empty.
    // Close→reopen used to look "restored" only because React state survived.
    const id = conversationId || readStoredConversationId();
    if (!id || messages.length > 0 || restoring) return;

    const attemptKey = id;
    if (restoreAttemptKeyRef.current === attemptKey) return;
    restoreAttemptKeyRef.current = attemptKey;
    void restoreConversation(id);
  }, [conversationId, messages.length, restoreConversation, restoring]);

  const startNewChat = useCallback(async () => {
    setError(null);
    setHistoryOpen(false);
    setMessages([]);
    setShowLeadCta(false);
    restoreAttemptKeyRef.current = null;
    leadPhaseRef.current = "idle";
    ctaUsedRef.current = false;

    try {
      const response = await fetch("/api/chat/conversations", {
        method: "POST",
        credentials: "same-origin",
      });
      const payload = (await response.json().catch(() => null)) as
        | {
            ok: true;
            conversation: { id: string; title: string; updatedAt: string };
          }
        | ChatApiError
        | null;

      if (response.ok && payload && payload.ok === true) {
        setConversationId(payload.conversation.id);
        writeStoredConversationId(payload.conversation.id);
        setConversations((current) => [
          {
            id: payload.conversation.id,
            title: payload.conversation.title,
            updatedAt: payload.conversation.updatedAt,
          },
          ...current.filter((item) => item.id !== payload.conversation.id),
        ]);
        return;
      }
    } catch {
      // Fall through to local-only new chat.
    }

    const id = crypto.randomUUID();
    setConversationId(id);
    writeStoredConversationId(id);
  }, []);

  const selectConversation = useCallback(
    async (id: string) => {
      setHistoryOpen(false);
      await restoreConversation(id);
    },
    [restoreConversation],
  );

  const toggleHistory = useCallback(() => {
    setHistoryOpen((current) => {
      const next = !current;
      if (next) {
        void loadConversationList();
      }
      return next;
    });
  }, [loadConversationList]);

  const sendMessage = useCallback(async (raw?: string) => {
    const content = (raw ?? input).trim();
    if (!content || sending || restoring) return;

    const userMessage = createLocalMessage("user", content);
    setInput("");
    setError(null);
    setSending(true);
    setMessages((current) => [...current, userMessage]);
    setShowLeadCta(false);
    setHistoryOpen(false);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationId,
          history: toHistory([...messages, userMessage]),
          channel: "website",
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | ChatApiSuccess
        | ChatApiError
        | null;

      if (!response.ok || !payload || payload.ok !== true || !isChatMessage(payload.message)) {
        const message =
          payload && payload.ok === false
            ? clientError(payload.error)
            : USER_FACING_CHAT_ERROR;
        setError(message);
        return;
      }

      const sources =
        parseSources(payload.message.sources) ??
        parseSources(payload.metadata?.sources);
      const lead = parseLeadMetadata(payload.metadata?.lead);

      const retrieval = payload.metadata?.retrieval;
      track(MIXPANEL_EVENTS.CHATBOT_MESSAGE_SENT, {
        channel: "website",
        message_type: lead?.messageType === "lead" ? "lead" : "info",
        retrieval_mode:
          retrieval?.mode === "hybrid" || retrieval?.mode === "sanity_fallback"
            ? retrieval.mode
            : undefined,
        reranker_used:
          typeof retrieval?.rerankerUsed === "boolean"
            ? retrieval.rerankerUsed
            : undefined,
        source_count:
          typeof retrieval?.sourceCount === "number"
            ? retrieval.sourceCount
            : undefined,
        retrieval_success:
          typeof retrieval?.success === "boolean"
            ? retrieval.success
            : undefined,
      });

      if (lead) {
        trackLeadTransition(leadPhaseRef.current, lead.phase);
        leadPhaseRef.current = lead.phase;

        const inLead =
          lead.phase !== "idle" &&
          lead.phase !== "submitted" &&
          lead.phase !== "failed";

        if (inLead) {
          ctaUsedRef.current = true;
          setShowLeadCta(false);
        } else if (lead.showCta && !ctaUsedRef.current) {
          ctaUsedRef.current = true;
          setShowLeadCta(true);
        } else {
          setShowLeadCta(false);
        }
      }

      setConversationId(payload.conversationId);
      // Only remember IDs that were actually saved — avoids broken refresh restore.
      if (payload.metadata?.persisted === true) {
        setPersistenceEnabled(true);
        writeStoredConversationId(payload.conversationId);
        restoreAttemptKeyRef.current = null;
        setConversations((current) => {
          const title =
            current.find((item) => item.id === payload.conversationId)?.title ||
            content.slice(0, 48);
          return [
            {
              id: payload.conversationId,
              title,
              updatedAt: new Date().toISOString(),
            },
            ...current.filter((item) => item.id !== payload.conversationId),
          ];
        });
      } else if (payload.metadata?.persisted === false) {
        setPersistenceEnabled(false);
        writeStoredConversationId(undefined);
      } else {
        writeStoredConversationId(payload.conversationId);
      }

      setMessages((current) => [
        ...current,
        sources ? { ...payload.message, sources } : payload.message,
      ]);
    } catch {
      setError(USER_FACING_CHAT_ERROR);
    } finally {
      setSending(false);
    }
  }, [conversationId, input, messages, restoring, sending]);

  return (
    <div className="pointer-events-none fixed right-3 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[60] flex flex-col items-end gap-3 sm:right-5 sm:bottom-[max(1.25rem,env(safe-area-inset-bottom))]">
      {open ? (
        <div className="pointer-events-auto">
          <ChatWindow
            messages={messages}
            input={input}
            sending={sending}
            loading={restoring}
            error={error}
            showLeadCta={showLeadCta}
            historyOpen={historyOpen}
            historyLoading={historyLoading}
            historyLoadError={
              historyLoadError ||
              (!persistenceEnabled
                ? "Chat history is unavailable right now. Messages still work in this session."
                : null)
            }
            conversations={conversations}
            activeConversationId={conversationId}
            onInputChange={setInput}
            onSubmit={() => {
              void sendMessage();
            }}
            onSuggest={(value) => {
              void sendMessage(value);
            }}
            onStartProject={() => {
              setShowLeadCta(false);
              void sendMessage(CHAT_LEAD_PROMPT);
            }}
            onSourceClick={(source) => {
              track(MIXPANEL_EVENTS.CHATBOT_SOURCE_CLICKED, {
                source_type: source.type,
                source_title: source.title,
              });
            }}
            onClose={() => setOpen(false)}
            onToggleHistory={toggleHistory}
            onCloseHistory={() => setHistoryOpen(false)}
            onSelectConversation={(id) => {
              void selectConversation(id);
            }}
            onNewChat={() => {
              void startNewChat();
            }}
          />
        </div>
      ) : (
        <button
          type="button"
          aria-labelledby={titleId}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-controls="computing-yard-chat"
          onClick={openChat}
          className={cn(
            "pointer-events-auto inline-flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[0_12px_32px_color-mix(in_srgb,var(--accent)_40%,transparent)] transition-transform",
            "hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "active:scale-[0.98]",
          )}
        >
          <span id={titleId} className="sr-only">
            Open Computing Yard chat
          </span>
          <MessageCircle className="size-6" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
