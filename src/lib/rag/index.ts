/**
 * RAG entrypoint.
 *
 * Phase 6: indexing (Sanity → chunk → embed → Qdrant + lexical corpus)
 * Phase 7: semantic retrieval (query → embed → Qdrant search)
 * Phase 8: hybrid retrieval (semantic + BM25 → RRF → rerank → context)
 *
 * The live chatbot still uses Sanity keyword retrieval via
 * src/lib/chatbot/knowledge — do not wire RAG into chat-service yet.
 */

import { semanticSearch } from "@/lib/rag/retrieval";
import type {
  RagSearchOptions,
  RagSearchProvider,
  RetrievalResult,
} from "@/lib/rag/types";

export type {
  HybridSearchMode,
  HybridSearchOptions,
  HybridSearchResult,
  IndexDocument,
  KnowledgeChunk,
  KnowledgeMetadata,
  LexicalSearchResult,
  RagDocumentType,
  RagSearchOptions,
  RagSearchProvider,
  RagSource,
  RetrievePipelineResult,
  RetrievalResult,
  SemanticSearchFilters,
  SemanticSearchOptions,
  SemanticSearchResult,
  VectorPointPayload,
} from "@/lib/rag/types";

export { RagConfigError, getQdrantConfig, requireVectorSize } from "@/lib/rag/qdrant/config";
export { checkQdrantHealth } from "@/lib/rag/qdrant/health";
export {
  collectionExists,
  ensureCollection,
  ensurePayloadIndexes,
  getCollectionSummary,
} from "@/lib/rag/qdrant/collection";

export {
  DEFAULT_EMBEDDING_MODEL,
  getEmbeddingConfig,
  getEmbeddingProvider,
  EmbeddingProviderError,
} from "@/lib/rag/embeddings";

export {
  formatIndexingReport,
  runRagIndexing,
  type IndexingReport,
} from "@/lib/rag/indexing";

export {
  DEFAULT_MAX_QUERY_CHARS,
  DEFAULT_SEMANTIC_LIMIT,
  getSemanticRetrievalConfig,
  isSemanticSearchError,
  SemanticSearchError,
  semanticSearch,
} from "@/lib/rag/retrieval";

export {
  DEFAULT_LEXICAL_LIMIT,
  LEXICAL_CORPUS_RELATIVE_PATH,
  getLexicalRetrievalConfig,
  lexicalSearch,
  LexicalSearchError,
} from "@/lib/rag/lexical";

export {
  DEFAULT_CONTEXT_LIMIT,
  DEFAULT_HYBRID_CANDIDATE_LIMIT,
  DEFAULT_MAX_CHUNKS_PER_DOCUMENT,
  DEFAULT_RRF_K,
  getHybridRetrievalConfig,
  HybridRetrievalError,
  retrieve,
  selectContext,
} from "@/lib/rag/hybrid";

export {
  DEFAULT_RERANK_MODEL,
  getRerankConfig,
  getRerankProvider,
  RerankerError,
} from "@/lib/rag/reranking";

/**
 * Optional adapter for the RagSearchProvider interface.
 * Not used by /api/chat — live chat remains on Sanity keyword retrieval.
 */
export function getRagProvider(): RagSearchProvider {
  return {
    async search(
      query: string,
      options?: RagSearchOptions,
    ): Promise<RetrievalResult[]> {
      const results = await semanticSearch(query, {
        limit: options?.limit,
        filters: {
          documentType: options?.documentTypes,
          source: options?.source,
        },
      });

      return results.map((result) => ({
        id: result.id,
        score: result.score,
        text: result.text,
        metadata: {
          documentId: result.documentId,
          documentType: result.documentType,
          title: result.title,
          slug: result.slug,
          url: result.url,
          section: result.section,
          source: result.source ?? "sanity",
          publishedAt: result.publishedAt,
          chunkIndex: result.chunkIndex,
        },
      }));
    },
  };
}
