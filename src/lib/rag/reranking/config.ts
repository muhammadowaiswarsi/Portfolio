/**
 * Reranker configuration (OpenRouter Cohere rerank).
 * Uses the same OPENROUTER_API_KEY as embeddings/chat when available.
 */

import { RagConfigError } from "@/lib/rag/qdrant/config";

function firstEnv(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

export const OPENROUTER_RERANK_URL = "https://openrouter.ai/api/v1/rerank";

/** Cost-efficient production Cohere reranker via OpenRouter. */
export const DEFAULT_RERANK_MODEL = "cohere/rerank-v3.5";

export type RerankConfig = {
  enabled: boolean;
  apiKey?: string;
  model: string;
  topN?: number;
};

/**
 * Reranking is enabled when RAG_RERANK_ENABLED is not "false"
 * AND an OpenRouter API key is present.
 */
export function getRerankConfig(): RerankConfig {
  const enabledFlag = firstEnv("RAG_RERANK_ENABLED");
  const explicitlyDisabled =
    enabledFlag === "0" || enabledFlag?.toLowerCase() === "false";

  const apiKey = firstEnv("OPENROUTER_API_KEY", "OPENAI_API_KEY");
  const model = firstEnv("RAG_RERANK_MODEL") || DEFAULT_RERANK_MODEL;

  const topRaw = firstEnv("RAG_RERANK_TOP_N");
  let topN: number | undefined;
  if (topRaw) {
    topN = Number.parseInt(topRaw, 10);
    if (!Number.isFinite(topN) || topN <= 0 || topN > 50) {
      throw new RagConfigError(
        "RAG_RERANK_TOP_N must be an integer between 1 and 50 when set.",
        "INVALID_RERANK_TOP_N",
      );
    }
  }

  return {
    enabled: !explicitlyDisabled && Boolean(apiKey),
    apiKey,
    model,
    topN,
  };
}
