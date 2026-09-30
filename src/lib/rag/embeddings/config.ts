import { RagConfigError } from "@/lib/rag/qdrant/config";

function firstEnv(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

export const OPENROUTER_EMBEDDINGS_URL =
  "https://openrouter.ai/api/v1/embeddings";

/** Default OpenAI-compatible 1536-dim embedding model via OpenRouter. */
export const DEFAULT_EMBEDDING_MODEL = "openai/text-embedding-3-small";

export type EmbeddingConfig = {
  apiKey: string;
  model: string;
  dimensions: number;
  batchSize: number;
};

export function getEmbeddingConfig(): EmbeddingConfig {
  const apiKey = firstEnv("OPENROUTER_API_KEY", "OPENAI_API_KEY");
  if (!apiKey) {
    throw new RagConfigError(
      "Missing embedding API key. Set OPENROUTER_API_KEY (or legacy OPENAI_API_KEY) for OpenRouter embeddings.",
      "MISSING_EMBEDDING_KEY",
    );
  }

  const model =
    firstEnv("EMBEDDING_MODEL", "RAG_EMBEDDING_MODEL") ||
    DEFAULT_EMBEDDING_MODEL;

  const dimensionsRaw = firstEnv("RAG_VECTOR_SIZE");
  const dimensions = dimensionsRaw
    ? Number.parseInt(dimensionsRaw, 10)
    : 1536;

  if (!Number.isFinite(dimensions) || dimensions <= 0) {
    throw new RagConfigError(
      "RAG_VECTOR_SIZE must be a positive integer for embeddings.",
      "INVALID_VECTOR_SIZE",
    );
  }

  const batchRaw = firstEnv("EMBEDDING_BATCH_SIZE");
  const batchSize = batchRaw ? Number.parseInt(batchRaw, 10) : 32;
  if (!Number.isFinite(batchSize) || batchSize <= 0 || batchSize > 128) {
    throw new RagConfigError(
      "EMBEDDING_BATCH_SIZE must be an integer between 1 and 128.",
      "INVALID_BATCH_SIZE",
    );
  }

  return {
    apiKey,
    model,
    dimensions,
    batchSize,
  };
}
