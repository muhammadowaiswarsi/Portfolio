/**
 * Hybrid / RRF / diversity / context configuration.
 */

import { RagConfigError } from "@/lib/rag/qdrant/config";

function firstEnv(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

function parseIntEnv(
  names: string[],
  fallback: number,
  label: string,
  min: number,
  max: number,
) {
  const raw = firstEnv(...names);
  const value = raw ? Number.parseInt(raw, 10) : fallback;
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new RagConfigError(
      `${label} must be an integer between ${min} and ${max}.`,
      "INVALID_HYBRID_CONFIG",
    );
  }
  return value;
}

export const DEFAULT_HYBRID_CANDIDATE_LIMIT = 12;
export const DEFAULT_CONTEXT_LIMIT = 6;
export const DEFAULT_MAX_CHUNKS_PER_DOCUMENT = 2;
export const DEFAULT_RRF_K = 60;

export type HybridRetrievalConfig = {
  hybridCandidateLimit: number;
  contextLimit: number;
  maxChunksPerDocument: number;
  rrfK: number;
};

export function getHybridRetrievalConfig(): HybridRetrievalConfig {
  return {
    hybridCandidateLimit: parseIntEnv(
      ["RAG_HYBRID_CANDIDATE_LIMIT"],
      DEFAULT_HYBRID_CANDIDATE_LIMIT,
      "RAG_HYBRID_CANDIDATE_LIMIT",
      1,
      50,
    ),
    contextLimit: parseIntEnv(
      ["RAG_CONTEXT_LIMIT"],
      DEFAULT_CONTEXT_LIMIT,
      "RAG_CONTEXT_LIMIT",
      1,
      20,
    ),
    maxChunksPerDocument: parseIntEnv(
      ["RAG_MAX_CHUNKS_PER_DOCUMENT"],
      DEFAULT_MAX_CHUNKS_PER_DOCUMENT,
      "RAG_MAX_CHUNKS_PER_DOCUMENT",
      1,
      10,
    ),
    rrfK: parseIntEnv(
      ["RAG_HYBRID_RRF_K"],
      DEFAULT_RRF_K,
      "RAG_HYBRID_RRF_K",
      1,
      200,
    ),
  };
}
