import {
  CHAT_LIMITS,
  type ChatChannel,
  type ChatHistoryItem,
} from "@/lib/chatbot/types";

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const CONVERSATION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type ParsedChatRequest = {
  message: string;
  conversationId?: string;
  history: ChatHistoryItem[];
  channel: ChatChannel;
};

function clean(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(CONTROL_CHARS, "").trim();
}

function isChannel(value: string): value is ChatChannel {
  return value === "website" || value === "whatsapp";
}

function parseHistory(value: unknown): ChatHistoryItem[] {
  if (!Array.isArray(value)) return [];

  const items: ChatHistoryItem[] = [];

  for (const entry of value.slice(-CHAT_LIMITS.history.maxMessages)) {
    if (!entry || typeof entry !== "object") continue;

    const row = entry as Record<string, unknown>;
    const role = clean(row.role);
    const content = clean(row.content);

    if (role !== "user" && role !== "assistant") continue;
    if (content.length < CHAT_LIMITS.message.min) continue;
    if (content.length > CHAT_LIMITS.message.max) continue;

    items.push({ role, content });
  }

  return items;
}

export function parseChatRequest(
  input: unknown,
): { ok: true; data: ParsedChatRequest } | { ok: false } {
  if (!input || typeof input !== "object") {
    return { ok: false };
  }

  const body = input as Record<string, unknown>;
  const message = clean(body.message);

  if (
    message.length < CHAT_LIMITS.message.min ||
    message.length > CHAT_LIMITS.message.max
  ) {
    return { ok: false };
  }

  const conversationIdRaw = clean(body.conversationId);
  const conversationId =
    conversationIdRaw &&
    conversationIdRaw.length <= CHAT_LIMITS.conversationId.max &&
    CONVERSATION_ID_PATTERN.test(conversationIdRaw)
      ? conversationIdRaw
      : undefined;

  const channelRaw = clean(body.channel);
  const channel: ChatChannel = isChannel(channelRaw) ? channelRaw : "website";

  return {
    ok: true,
    data: {
      message,
      conversationId,
      history: parseHistory(body.history),
      channel,
    },
  };
}
