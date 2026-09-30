/**
 * Server-only semantic retrieval:
 * query → embed → Qdrant vector search → normalize.
 *
 * Does NOT call the LLM, keyword search, or chat-service.
 * Never import from client components.
 */

import { EmbeddingProviderError, getEmbeddingProvider } from "@/lib/rag/embeddings";
import { getQdrantClient, toQdrantError } from "@/lib/rag/qdrant/client";
import { getQdrantConfig, RagConfigError } from "@/lib/rag/qdrant/config";
import {
  getSemanticRetrievalConfig,
  type SemanticRetrievalConfig,
} from "@/lib/rag/retrieval/config";
import { SemanticSearchError } from "@/lib/rag/retrieval/errors";
import { buildQdrantFilter } from "@/lib/rag/retrieval/filters";
import { normalizeScoredPoints } from "@/lib/rag/retrieval/normalize";
import type {
  SemanticSearchOptions,
  SemanticSearchResult,
} from "@/lib/rag/types";

function toSemanticError(error: unknown): SemanticSearchError {
  if (error instanceof SemanticSearchError) return error;

  if (error instanceof RagConfigError) {
    return new SemanticSearchError(error.message, error.code);
  }

  if (error instanceof EmbeddingProviderError) {
    return new SemanticSearchError(error.message, error.code, error.status);
  }

  const qdrant = toQdrantError(error);
  return new SemanticSearchError(qdrant.message, qdrant.code, qdrant.status);
}

function validateQuery(
  query: string,
  config: SemanticRetrievalConfig,
): string {
  if (typeof query !== "string") {
    throw new SemanticSearchError(
      "Semantic search query must be a string.",
      "INVALID_QUERY",
    );
  }

  const trimmed = query.trim();
  if (!trimmed) {
    throw new SemanticSearchError(
      "Semantic search query must not be empty.",
      "EMPTY_QUERY",
    );
  }

  if (trimmed.length > config.maxQueryChars) {
    throw new SemanticSearchError(
      `Semantic search query exceeds the maximum length of ${config.maxQueryChars} characters.`,
      "QUERY_TOO_LONG",
    );
  }

  return trimmed;
}

function resolveLimit(
  options: SemanticSearchOptions | undefined,
  config: SemanticRetrievalConfig,
) {
  if (options?.limit === undefined) return config.limit;
  const limit = options.limit;
  if (!Number.isFinite(limit) || limit <= 0 || limit > 50) {
    throw new SemanticSearchError(
      "Semantic search limit must be an integer between 1 and 50.",
      "INVALID_LIMIT",
    );
  }
  return Math.trunc(limit);
}

function resolveScoreThreshold(
  options: SemanticSearchOptions | undefined,
  config: SemanticRetrievalConfig,
): number | undefined {
  const value =
    options?.scoreThreshold !== undefined
      ? options.scoreThreshold
      : config.scoreThreshold;

  if (value === undefined) return undefined;

  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new SemanticSearchError(
      "Semantic search scoreThreshold must be a number between 0 and 1.",
      "INVALID_SCORE_THRESHOLD",
    );
  }

  return value;
}

/**
 * Embed a query and search Qdrant for the most similar knowledge chunks.
 * Returns [] when there are no matches. Throws SemanticSearchError on infrastructure failures.
 */
export async function semanticSearch(
  query: string,
  options?: SemanticSearchOptions,
): Promise<SemanticSearchResult[]> {
  const started = Date.now();

  try {
    const retrievalConfig = getSemanticRetrievalConfig();
    const qdrantConfig = getQdrantConfig();
    const cleaned = validateQuery(query, retrievalConfig);
    const limit = resolveLimit(options, retrievalConfig);
    const scoreThreshold = resolveScoreThreshold(options, retrievalConfig);
    const filter = buildQdrantFilter(options?.filters);

    const embeddings = getEmbeddingProvider();
    const vector = await embeddings.embedText(cleaned);

    if (vector.length !== embeddings.dimensions) {
      throw new SemanticSearchError(
        `Query embedding dimension mismatch: expected ${embeddings.dimensions}, got ${vector.length}.`,
        "DIMENSION_MISMATCH",
      );
    }

    const client = getQdrantClient(qdrantConfig);

    const response = await client.query(qdrantConfig.collection, {
      query: vector,
      limit,
      score_threshold: scoreThreshold,
      filter,
      with_payload: true,
      with_vector: false,
    });

    const results = normalizeScoredPoints(
      (response.points ?? []).map((point) => ({
        id: point.id,
        score: point.score,
        payload:
          point.payload && typeof point.payload === "object"
            ? (point.payload as Record<string, unknown>)
            : null,
      })),
    );

    // Keep descending score order (Qdrant already ranks; re-sort after skips).
    results.sort((a, b) => b.score - a.score);

    console.info("Semantic search completed.", {
      queryLength: cleaned.length,
      resultCount: results.length,
      limit,
      scoreThreshold: scoreThreshold ?? null,
      filtered: Boolean(filter),
      latencyMs: Date.now() - started,
      collection: qdrantConfig.collection,
      vectorSize: vector.length,
    });

    return results;
  } catch (error) {
    console.error("Semantic search failed.", {
      latencyMs: Date.now() - started,
      code:
        error instanceof SemanticSearchError ||
        error instanceof EmbeddingProviderError ||
        error instanceof RagConfigError
          ? error.code
          : "UNKNOWN",
    });
    throw toSemanticError(error);
  }
}
