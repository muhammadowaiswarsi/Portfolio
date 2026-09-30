/**
 * RAG knowledge types for indexing and future retrieval.
 */

export type RagDocumentType =
  | "company"
  | "service"
  | "project"
  | "blog"
  | "faq"
  | "technology"
  | "testimonial"
  | "process";

export type RagSource = "sanity" | "static" | "manual";

export type IndexDocument = {
  documentId: string;
  documentType: RagDocumentType;
  title: string;
  text: string;
  slug?: string;
  url?: string;
  section?: string;
  source: RagSource;
  publishedAt?: string;
};

export type KnowledgeChunk = {
  id: string;
  documentId: string;
  documentType: RagDocumentType;
  title: string;
  text: string;
  slug?: string;
  url?: string;
  section?: string;
  source: RagSource;
  publishedAt?: string;
  chunkIndex: number;
};

export type KnowledgeMetadata = {
  documentId: string;
  documentType: RagDocumentType;
  title: string;
  slug?: string;
  url?: string;
  section?: string;
  source: RagSource;
  publishedAt?: string;
  chunkIndex?: number;
};

/**
 * Payload stored on a Qdrant point.
 * Vectors themselves are never part of the payload.
 */
export type VectorPointPayload = {
  chunkId: string;
  documentId: string;
  documentType: RagDocumentType;
  title: string;
  slug?: string;
  url?: string;
  section?: string;
  chunkIndex: number;
  text: string;
  source: RagSource;
  publishedAt?: string;
};

export type RetrievalResult = {
  id: string;
  score: number;
  text: string;
  metadata: KnowledgeMetadata;
};

export type RagSearchOptions = {
  limit?: number;
  documentTypes?: RagDocumentType[];
  source?: RagSource;
};

export type RagSearchProvider = {
  search(query: string, options?: RagSearchOptions): Promise<RetrievalResult[]>;
};

/**
 * Optional payload filters for semantic search.
 * Applied in Qdrant — not post-filtered in application code.
 */
export type SemanticSearchFilters = {
  documentType?: RagDocumentType | RagDocumentType[];
  source?: RagSource | RagSource[];
  documentId?: string | string[];
  slug?: string | string[];
};

export type SemanticSearchOptions = {
  limit?: number;
  /**
   * Minimum cosine similarity score.
   * Optional — calibrate later; leave unset to return top-K by ranking.
   */
  scoreThreshold?: number;
  filters?: SemanticSearchFilters;
};

/**
 * Normalized semantic hit. Mirrors indexed VectorPointPayload fields.
 */
export type SemanticSearchResult = {
  id: string;
  score: number;
  text: string;
  documentId: string;
  documentType: RagDocumentType;
  title: string;
  slug?: string;
  url?: string;
  section?: string;
  chunkIndex?: number;
  source?: RagSource;
  publishedAt?: string;
  chunkId?: string;
};

/** Lexical (BM25) hit — same chunk identity as Qdrant points. */
export type LexicalSearchResult = {
  id: string;
  score: number;
  text: string;
  documentId: string;
  documentType: RagDocumentType;
  title: string;
  slug?: string;
  url?: string;
  section?: string;
  chunkIndex?: number;
  source?: RagSource;
  publishedAt?: string;
  chunkId?: string;
};

export type HybridSearchMode = "semantic" | "lexical" | "hybrid";

export type HybridSearchOptions = {
  mode?: HybridSearchMode;
  semanticLimit?: number;
  lexicalLimit?: number;
  hybridCandidateLimit?: number;
  contextLimit?: number;
  maxChunksPerDocument?: number;
  /** Reciprocal Rank Fusion constant k. */
  rrfK?: number;
  scoreThreshold?: number;
  filters?: SemanticSearchFilters;
  /** When false, skip reranker even if configured. Default true. */
  rerank?: boolean;
};

/**
 * Unified hybrid / reranked retrieval result for Phase 8+.
 */
export type HybridSearchResult = {
  id: string;
  text: string;
  title: string;
  documentId: string;
  documentType: RagDocumentType;
  slug?: string;
  url?: string;
  section?: string;
  chunkIndex?: number;
  source?: RagSource;
  publishedAt?: string;
  chunkId?: string;
  semanticScore?: number;
  lexicalScore?: number;
  hybridScore?: number;
  rerankScore?: number;
  finalRank: number;
};

export type RetrievePipelineResult = {
  query: string;
  mode: HybridSearchMode;
  semantic: SemanticSearchResult[];
  lexical: LexicalSearchResult[];
  hybrid: HybridSearchResult[];
  reranked: HybridSearchResult[];
  context: HybridSearchResult[];
  rerankApplied: boolean;
  notes: string[];
  latencyMs: number;
};
