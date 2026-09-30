import {
  ensureChatSession,
  getConversationDetail,
  isChatPersistenceConfigured,
} from "@/lib/chatbot/persistence";
import { consumeRateLimit, getRequestIp } from "@/lib/chatbot/rate-limit";

function jsonError(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
}

const CONVERSATION_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const limit = consumeRateLimit(`chat-history:${getRequestIp(request)}`, 40);

  if (!limit.allowed) {
    return jsonError("Please wait a moment before loading history.", 429);
  }

  if (!isChatPersistenceConfigured()) {
    return jsonError("Chat history is not available yet.", 503);
  }

  const { id } = await context.params;
  if (!CONVERSATION_ID_PATTERN.test(id)) {
    return jsonError("Conversation not found.", 404);
  }

  try {
    const session = await ensureChatSession();
    const detail = await getConversationDetail(id, session.sessionId);

    if (!detail) {
      // Ownership failure and missing conversation look the same.
      return jsonError("Conversation not found.", 404);
    }

    return Response.json({ ok: true, conversation: detail });
  } catch {
    console.error("Load conversation failed.");
    return jsonError("Unable to load this conversation right now.", 500);
  }
}
