/**
 * Semantic retrieval public API (Phase 7).
 * Isolated from the live chatbot Sanity keyword path.
 */

export {
  DEFAULT_MAX_QUERY_CHARS,
  DEFAULT_SEMANTIC_LIMIT,
  getSemanticRetrievalConfig,
  type SemanticRetrievalConfig,
} from "@/lib/rag/retrieval/config";
export {
  isSemanticSearchError,
  SemanticSearchError,
} from "@/lib/rag/retrieval/errors";
export { buildQdrantFilter } from "@/lib/rag/retrieval/filters";
export {
  normalizeScoredPoint,
  normalizeScoredPoints,
  type RawScoredPoint,
} from "@/lib/rag/retrieval/normalize";
export { semanticSearch } from "@/lib/rag/retrieval/search";
