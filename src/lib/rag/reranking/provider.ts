/**
 * Reranker provider errors.
 */

export class RerankerError extends Error {
  readonly code: string;
  readonly status?: number;

  constructor(message: string, code: string, status?: number) {
    super(message);
    this.name = "RerankerError";
    this.code = code;
    this.status = status;
  }
}

export type RerankDocument = {
  id: string;
  text: string;
};

export type RerankHit = {
  id: string;
  index: number;
  score: number;
};

export type RerankProvider = {
  model: string;
  available: boolean;
  rerank(
    query: string,
    documents: RerankDocument[],
    topN?: number,
  ): Promise<RerankHit[]>;
};
