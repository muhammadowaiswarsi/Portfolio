import { CHAT_MODEL, OPENROUTER_CHAT_URL, USER_FACING_CHAT_ERROR } from "@/lib/chatbot/config";
import { getSiteUrl, siteName } from "@/lib/site";

export type AIChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type GenerateResponseInput = {
  messages: AIChatMessage[];
};

export type GenerateResponseOutput = {
  content: string;
  model: string;
};

export type AIProvider = {
  generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput>;
};

export class AIProviderError extends Error {
  readonly status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "AIProviderError";
    this.status = status;
  }
}

export class AINotConfiguredError extends AIProviderError {
  constructor() {
    super("The assistant is temporarily unavailable.", 503);
    this.name = "AINotConfiguredError";
  }
}

type OpenRouterChatCompletion = {
  model?: string;
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
  error?: {
    code?: unknown;
    message?: unknown;
  };
};

function firstEnv(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }

  return undefined;
}

function getApiKey() {
  return firstEnv("OPENROUTER_API_KEY", "OPENAI_API_KEY");
}

function statusForProviderFailure(status: number) {
  if (status === 401 || status === 403) return 503;
  if (status === 402 || status === 429) return 429;
  if (status >= 500) return 502;
  return 502;
}

function readMessageContent(content: unknown) {
  if (typeof content === "string") return content.trim();

  if (!Array.isArray(content)) return "";

  return content
    .map((part) => {
      if (typeof part === "string") return part;
      if (!part || typeof part !== "object") return "";
      const row = part as Record<string, unknown>;
      if (typeof row.text === "string") return row.text;
      if (typeof row.content === "string") return row.content;
      return "";
    })
    .join("")
    .trim();
}

function logProviderFailure(status: number, payload: unknown) {
  let code: string | number | undefined;

  if (payload && typeof payload === "object") {
    const error = (payload as OpenRouterChatCompletion).error;
    if (error && typeof error === "object" && error.code != null) {
      if (typeof error.code === "string" || typeof error.code === "number") {
        code = error.code;
      }
    }
  }

  console.error("OpenRouter request failed.", { status, code });
}

export function createOpenRouterProvider(): AIProvider {
  return {
    async generateResponse(input) {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new AINotConfiguredError();
      }

      const model = CHAT_MODEL;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30_000);

      try {
        const response = await fetch(OPENROUTER_CHAT_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": getSiteUrl(),
            "X-OpenRouter-Title": `${siteName} Assistant`,
            "X-Title": `${siteName} Assistant`,
          },
          body: JSON.stringify({
            model,
            temperature: 0.4,
            max_tokens: 600,
            messages: input.messages,
          }),
          signal: controller.signal,
        });

        let payload: unknown = null;
        try {
          payload = await response.json();
        } catch {
          payload = null;
        }

        if (!response.ok) {
          logProviderFailure(response.status, payload);
          throw new AIProviderError(
            USER_FACING_CHAT_ERROR,
            statusForProviderFailure(response.status),
          );
        }

        const completion = (payload ?? {}) as OpenRouterChatCompletion;
        const content = readMessageContent(completion.choices?.[0]?.message?.content);

        if (!content) {
          console.error("OpenRouter returned an empty completion.");
          throw new AIProviderError(USER_FACING_CHAT_ERROR, 502);
        }

        return {
          content,
          model: completion.model || model,
        };
      } catch (error) {
        if (error instanceof AIProviderError) {
          throw error;
        }

        if (error instanceof Error && error.name === "AbortError") {
          console.error("OpenRouter request timed out.");
          throw new AIProviderError(USER_FACING_CHAT_ERROR, 504);
        }

        console.error("OpenRouter request failed.");
        throw new AIProviderError(USER_FACING_CHAT_ERROR, 502);
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}

export function getAIProvider(): AIProvider {
  return createOpenRouterProvider();
}
