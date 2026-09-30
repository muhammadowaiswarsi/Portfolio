/**
 * Okapi BM25 (Robertson / Zaragoza) over in-memory inverted index.
 * Deterministic given the same corpus and parameters.
 */

import { tokenize } from "@/lib/rag/lexical/tokenize";

export type Bm25Document = {
  id: string;
  /** Full searchable text (title + section + body). */
  searchText: string;
};

export type Bm25Hit = {
  id: string;
  score: number;
};

export type Bm25Params = {
  k1?: number;
  b?: number;
};

type IndexedDoc = {
  id: string;
  length: number;
  termFreq: Map<string, number>;
};

export class Bm25Index {
  readonly k1: number;
  readonly b: number;
  private readonly docs: IndexedDoc[] = [];
  private readonly docFreq = new Map<string, number>();
  private avgdl = 0;

  constructor(documents: Bm25Document[], params: Bm25Params = {}) {
    this.k1 = params.k1 ?? 1.2;
    this.b = params.b ?? 0.75;

    let totalLength = 0;

    for (const document of documents) {
      const tokens = tokenize(document.searchText);
      const termFreq = new Map<string, number>();
      for (const token of tokens) {
        termFreq.set(token, (termFreq.get(token) ?? 0) + 1);
      }

      for (const term of termFreq.keys()) {
        this.docFreq.set(term, (this.docFreq.get(term) ?? 0) + 1);
      }

      this.docs.push({
        id: document.id,
        length: tokens.length,
        termFreq,
      });
      totalLength += tokens.length;
    }

    this.avgdl = this.docs.length > 0 ? totalLength / this.docs.length : 0;
  }

  get size() {
    return this.docs.length;
  }

  private idf(term: string) {
    const n = this.docFreq.get(term) ?? 0;
    const N = this.docs.length;
    // Lucene/Okapi-style smoothed IDF
    return Math.log(1 + (N - n + 0.5) / (n + 0.5));
  }

  search(query: string, limit: number): Bm25Hit[] {
    const terms = tokenize(query);
    if (terms.length === 0 || this.docs.length === 0 || limit <= 0) {
      return [];
    }

    const uniqueTerms = [...new Set(terms)];
    const scores = new Map<string, number>();

    for (const doc of this.docs) {
      let score = 0;
      for (const term of uniqueTerms) {
        const tf = doc.termFreq.get(term);
        if (!tf) continue;
        const idf = this.idf(term);
        const denom =
          tf +
          this.k1 *
            (1 - this.b + this.b * (doc.length / (this.avgdl || 1)));
        score += idf * ((tf * (this.k1 + 1)) / denom);
      }
      if (score > 0) {
        scores.set(doc.id, score);
      }
    }

    return [...scores.entries()]
      .map(([id, score]) => ({ id, score }))
      .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
      .slice(0, limit);
  }
}
