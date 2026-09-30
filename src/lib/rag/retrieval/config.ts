/**
 * Server-only semantic retrieval configuration.
 * Threshold is optional — calibrate later with evaluation queries.
 */

import { RagConfigError } from "@/lib/rag/qdrant/config";

function firstEnv(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

export const DEFAULT_SEMANTIC_LIMIT = 8;
export const DEFAULT_MAX_QUERY_CHARS = 1_000;

export type SemanticRetrievalConfig = {
  limit: number;
  /** When undefined, no client-side/Qdrant score filtering is applied. */
  scoreThreshold?: number;
  maxQueryChars: number;
};

export function getSemanticRetrievalConfig(): SemanticRetrievalConfig {
  const limitRaw = firstEnv("RAG_SEMANTIC_LIMIT");
  const limit = limitRaw
    ? Number.parseInt(limitRaw, 10)
    : DEFAULT_SEMANTIC_LIMIT;

  if (!Number.isFinite(limit) || limit <= 0 || limit > 50) {
    throw new RagConfigError(
      "RAG_SEMANTIC_LIMIT must be an integer between 1 and 50.",
      "INVALID_SEMANTIC_LIMIT",
    );
  }

  const thresholdRaw = firstEnv("RAG_SEMANTIC_SCORE_THRESHOLD");
  let scoreThreshold: number | undefined;

  if (thresholdRaw) {
    scoreThreshold = Number.parseFloat(thresholdRaw);
    if (
      !Number.isFinite(scoreThreshold) ||
      scoreThreshold < 0 ||
      scoreThreshold > 1
    ) {
      throw new RagConfigError(
        "RAG_SEMANTIC_SCORE_THRESHOLD must be a number between 0 and 1 when set. Leave empty until calibrated.",
        "INVALID_SCORE_THRESHOLD",
      );
    }
  }

  const maxRaw = firstEnv("RAG_SEMANTIC_MAX_QUERY_CHARS");
  const maxQueryChars = maxRaw
    ? Number.parseInt(maxRaw, 10)
    : DEFAULT_MAX_QUERY_CHARS;

  if (
    !Number.isFinite(maxQueryChars) ||
    maxQueryChars < 16 ||
    maxQueryChars > 8_000
  ) {
    throw new RagConfigError(
      "RAG_SEMANTIC_MAX_QUERY_CHARS must be an integer between 16 and 8000.",
      "INVALID_MAX_QUERY_CHARS",
    );
  }

  return {
    limit,
    scoreThreshold,
    maxQueryChars,
  };
}
