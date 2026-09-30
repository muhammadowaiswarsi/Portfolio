/**
 * Server-only embedding provider (OpenRouter OpenAI-compatible embeddings).
 * Never import from client components. Never invent/fake vectors.
 */

import { getSiteUrl, siteName } from "@/lib/site";
import {
  getEmbeddingConfig,
  OPENROUTER_EMBEDDINGS_URL,
  type EmbeddingConfig,
} from "@/lib/rag/embeddings/config";
import { RagConfigError } from "@/lib/rag/qdrant/config";

export class EmbeddingProviderError extends Error {
  readonly code: string;
  readonly status?: number;

  constructor(message: string, code: string, status?: number) {
    super(message);
    this.name = "EmbeddingProviderError";
    this.code = code;
    this.status = status;
  }
}

export type EmbeddingProvider = {
  model: string;
  dimensions: number;
  embedText(text: string): Promise<number[]>;
  embedTexts(texts: string[]): Promise<number[][]>;
};

type OpenRouterEmbeddingResponse = {
  model?: string;
  data?: Array<{
    embedding?: number[];
    index?: number;
  }>;
  error?: {
    code?: unknown;
    message?: unknown;
  };
};

function assertVectorDimension(
  vector: number[],
  expected: number,
  index: number,
) {
  if (vector.length !== expected) {
    throw new EmbeddingProviderError(
      `Embedding dimension mismatch at index ${index}: expected ${expected}, got ${vector.length}.`,
      "DIMENSION_MISMATCH",
    );
  }
}

function validateTexts(texts: string[]) {
  if (texts.length === 0) {
    throw new EmbeddingProviderError(
      "No texts provided for embedding.",
      "EMPTY_INPUT",
    );
  }

  for (const [index, text] of texts.entries()) {
    if (typeof text !== "string" || text.trim().length === 0) {
      throw new EmbeddingProviderError(
        `Embedding input at index ${index} is empty.`,
        "EMPTY_INPUT",
      );
    }
  }
}

async function requestEmbeddings(
  config: EmbeddingConfig,
  texts: string[],
): Promise<number[][]> {
  validateTexts(texts);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const response = await fetch(OPENROUTER_EMBEDDINGS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": getSiteUrl(),
        "X-OpenRouter-Title": `${siteName} RAG Indexer`,
        "X-Title": `${siteName} RAG Indexer`,
      },
      body: JSON.stringify({
        model: config.model,
        input: texts.length === 1 ? texts[0] : texts,
        dimensions: config.dimensions,
        encoding_format: "float",
      }),
      signal: controller.signal,
    });

    let payload: OpenRouterEmbeddingResponse | null = null;
    try {
      payload = (await response.json()) as OpenRouterEmbeddingResponse;
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const code =
        response.status === 401 || response.status === 403
          ? "AUTH_FAILED"
          : response.status === 429
            ? "RATE_LIMITED"
            : "REQUEST_FAILED";

      console.error("Embedding request failed.", {
        status: response.status,
        code:
          payload?.error && typeof payload.error.code !== "undefined"
            ? payload.error.code
            : undefined,
      });

      throw new EmbeddingProviderError(
        code === "AUTH_FAILED"
          ? "Embedding provider rejected the API key."
          : code === "RATE_LIMITED"
            ? "Embedding provider rate limit reached. Retry later."
            : "Embedding provider request failed.",
        code,
        response.status,
      );
    }

    const rows = [...(payload?.data ?? [])].sort(
      (a, b) => (a.index ?? 0) - (b.index ?? 0),
    );

    if (rows.length !== texts.length) {
      throw new EmbeddingProviderError(
        `Embedding provider returned ${rows.length} vectors for ${texts.length} inputs.`,
        "RESPONSE_MISMATCH",
      );
    }

    return rows.map((row, index) => {
      const embedding = row.embedding;
      if (!Array.isArray(embedding) || embedding.length === 0) {
        throw new EmbeddingProviderError(
          `Embedding provider returned an empty vector at index ${index}.`,
          "EMPTY_VECTOR",
        );
      }
      if (!embedding.every((value) => typeof value === "number" && Number.isFinite(value))) {
        throw new EmbeddingProviderError(
          `Embedding provider returned a non-numeric vector at index ${index}.`,
          "INVALID_VECTOR",
        );
      }
      assertVectorDimension(embedding, config.dimensions, index);
      return embedding;
    });
  } catch (error) {
    if (error instanceof EmbeddingProviderError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new EmbeddingProviderError(
        "Embedding request timed out.",
        "TIMEOUT",
        504,
      );
    }
    throw new EmbeddingProviderError(
      "Embedding provider is temporarily unavailable.",
      "CONNECTION_FAILED",
    );
  } finally {
    clearTimeout(timeout);
  }
}

export function createOpenRouterEmbeddingProvider(
  config = getEmbeddingConfig(),
): EmbeddingProvider {
  return {
    model: config.model,
    dimensions: config.dimensions,
    async embedText(text: string) {
      const [vector] = await requestEmbeddings(config, [text]);
      return vector;
    },
    async embedTexts(texts: string[]) {
      if (texts.length === 0) return [];

      const vectors: number[][] = [];
      for (let i = 0; i < texts.length; i += config.batchSize) {
        const batch = texts.slice(i, i + config.batchSize);
        const batchVectors = await requestEmbeddings(config, batch);
        vectors.push(...batchVectors);
      }
      return vectors;
    },
  };
}

export function getEmbeddingProvider(): EmbeddingProvider {
  try {
    return createOpenRouterEmbeddingProvider();
  } catch (error) {
    if (error instanceof RagConfigError) {
      throw new EmbeddingProviderError(error.message, error.code);
    }
    throw error;
  }
}
