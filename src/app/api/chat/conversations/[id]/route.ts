import { NextResponse } from "next/server";

import {
  CHAT_SESSION_COOKIE,
  chatSessionCookieOptions,
  ensureChatSession,
  getConversationDetail,
  isChatPersistenceConfigured,
} from "@/lib/chatbot/persistence";
import { consumeRateLimit, getRequestIp } from "@/lib/chatbot/rate-limit";

function jsonError(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

function withSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(
    CHAT_SESSION_COOKIE,
    token,
    chatSessionCookieOptions(),
  );
  return response;
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
      return withSessionCookie(
        jsonError("Conversation not found.", 404),
        session.token,
      );
    }

    return withSessionCookie(
      NextResponse.json({ ok: true, conversation: detail }),
      session.token,
    );
  } catch (error) {
    console.error("Load conversation failed.", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return jsonError("Unable to load this conversation right now.", 500);
  }
}
