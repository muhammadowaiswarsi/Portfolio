import {
  createEmptyConversation,
  ensureChatSession,
  isChatPersistenceConfigured,
  listConversationsForSession,
} from "@/lib/chatbot/persistence";
import { consumeRateLimit, getRequestIp } from "@/lib/chatbot/rate-limit";

function jsonError(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
}

export async function GET(request: Request) {
  const limit = consumeRateLimit(`chat-history:${getRequestIp(request)}`, 40);

  if (!limit.allowed) {
    return jsonError("Please wait a moment before loading history.", 429);
  }

  if (!isChatPersistenceConfigured()) {
    return jsonError("Chat history is not available yet.", 503);
  }

  try {
    const session = await ensureChatSession();
    const conversations = await listConversationsForSession(session.sessionId);
    return Response.json({ ok: true, conversations });
  } catch {
    console.error("List conversations failed.");
    return jsonError("Unable to load conversations right now.", 500);
  }
}

export async function POST(request: Request) {
  const limit = consumeRateLimit(`chat-history:${getRequestIp(request)}`, 40);

  if (!limit.allowed) {
    return jsonError("Please wait a moment before starting a new chat.", 429);
  }

  if (!isChatPersistenceConfigured()) {
    return jsonError("Chat history is not available yet.", 503);
  }

  try {
    const session = await ensureChatSession();
    const conversation = await createEmptyConversation(session.sessionId);
    return Response.json({
      ok: true,
      conversation: {
        id: conversation._id,
        title: conversation.title,
        updatedAt: conversation.updatedAt.toISOString(),
      },
    });
  } catch {
    console.error("Create conversation failed.");
    return jsonError("Unable to start a new conversation right now.", 500);
  }
}
