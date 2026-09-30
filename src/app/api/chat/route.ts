import { ChatServiceError, createChatReply } from "@/lib/chatbot/chat-service";
import { USER_FACING_CHAT_ERROR } from "@/lib/chatbot/config";
import {
  ensureChatSession,
  isChatPersistenceConfigured,
} from "@/lib/chatbot/persistence";
import { parseChatRequest } from "@/lib/chatbot/request";
import { consumeRateLimit, getRequestIp } from "@/lib/chatbot/rate-limit";

function jsonError(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
}

export function GET() {
  return jsonError("Method not allowed.", 405);
}

export async function POST(request: Request) {
  const limit = consumeRateLimit(`chat:${getRequestIp(request)}`);

  if (!limit.allowed) {
    return jsonError("Please wait a moment before sending another message.", 429);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request.", 400);
  }

  const parsed = parseChatRequest(body);

  if (!parsed.ok) {
    return jsonError("Please enter a valid message.", 400);
  }

  let sessionId: string | undefined;

  if (isChatPersistenceConfigured()) {
    try {
      const session = await ensureChatSession();
      sessionId = session.sessionId;
    } catch (error) {
      console.error("Chat session bootstrap failed.", {
        code:
          error && typeof error === "object" && "code" in error
            ? String((error as { code?: unknown }).code)
            : "SESSION_FAILED",
      });
      // Continue without persistence rather than failing the chat.
    }
  }

  try {
    const result = await createChatReply(parsed.data, { sessionId });

    return Response.json({
      ok: true,
      message: result.message,
      conversationId: result.conversationId,
      metadata: result.metadata,
    });
  } catch (error) {
    if (error instanceof ChatServiceError) {
      console.error("Chat service error.", { status: error.status });
      return jsonError(error.message, error.status);
    }

    console.error("Chat request failed.");
    return jsonError(USER_FACING_CHAT_ERROR, 500);
  }
}
