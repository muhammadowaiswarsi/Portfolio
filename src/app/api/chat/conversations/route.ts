import { NextResponse } from "next/server";

import {
  CHAT_SESSION_COOKIE,
  chatSessionCookieOptions,
  createEmptyConversation,
  ensureChatSession,
  isChatPersistenceConfigured,
  listConversationsForSession,
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
    return withSessionCookie(
      NextResponse.json({ ok: true, conversations }),
      session.token,
    );
  } catch (error) {
    console.error("List conversations failed.", {
      message: error instanceof Error ? error.message : "unknown",
    });
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
    return withSessionCookie(
      NextResponse.json({
        ok: true,
        conversation: {
          id: conversation._id,
          title: conversation.title,
          updatedAt: conversation.updatedAt.toISOString(),
        },
      }),
      session.token,
    );
  } catch (error) {
    console.error("Create conversation failed.", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return jsonError("Unable to start a new conversation right now.", 500);
  }
}
