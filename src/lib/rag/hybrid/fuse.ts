/**
 * Fuse semantic + lexical ranked lists via Reciprocal Rank Fusion.
 */

import { reciprocalRankFusion } from "@/lib/rag/hybrid/rrf";
import type {
  HybridSearchResult,
  LexicalSearchResult,
  SemanticSearchResult,
} from "@/lib/rag/types";

type MetaBag = {
  id: string;
  text: string;
  title: string;
  documentId: string;
  documentType: HybridSearchResult["documentType"];
  slug?: string;
  url?: string;
  section?: string;
  chunkIndex?: number;
  source?: HybridSearchResult["source"];
  publishedAt?: string;
  chunkId?: string;
  semanticScore?: number;
  lexicalScore?: number;
};

function fromSemantic(result: SemanticSearchResult): MetaBag {
  return {
    id: result.id,
    text: result.text,
    title: result.title,
    documentId: result.documentId,
    documentType: result.documentType,
    slug: result.slug,
    url: result.url,
    section: result.section,
    chunkIndex: result.chunkIndex,
    source: result.source,
    publishedAt: result.publishedAt,
    chunkId: result.chunkId,
    semanticScore: result.score,
  };
}

function fromLexical(result: LexicalSearchResult): MetaBag {
  return {
    id: result.id,
    text: result.text,
    title: result.title,
    documentId: result.documentId,
    documentType: result.documentType,
    slug: result.slug,
    url: result.url,
    section: result.section,
    chunkIndex: result.chunkIndex,
    source: result.source,
    publishedAt: result.publishedAt,
    chunkId: result.chunkId,
    lexicalScore: result.score,
  };
}

function mergeMeta(base: MetaBag, extra: MetaBag): MetaBag {
  return {
    ...base,
    ...extra,
    semanticScore: extra.semanticScore ?? base.semanticScore,
    lexicalScore: extra.lexicalScore ?? base.lexicalScore,
    text: extra.text || base.text,
    title: extra.title || base.title,
  };
}

export function fuseHybridCandidates(input: {
  semantic: SemanticSearchResult[];
  lexical: LexicalSearchResult[];
  rrfK: number;
  limit: number;
}): HybridSearchResult[] {
  const byId = new Map<string, MetaBag>();

  for (const result of input.semantic) {
    byId.set(result.id, fromSemantic(result));
  }
  for (const result of input.lexical) {
    const existing = byId.get(result.id);
    const next = fromLexical(result);
    byId.set(result.id, existing ? mergeMeta(existing, next) : next);
  }

  const fused = reciprocalRankFusion(
    [
      { name: "semantic", items: input.semantic.map((r) => ({ id: r.id })) },
      { name: "lexical", items: input.lexical.map((r) => ({ id: r.id })) },
    ],
    input.rrfK,
  );

  const results: HybridSearchResult[] = [];
  for (const [index, item] of fused.entries()) {
    if (results.length >= input.limit) break;
    const meta = byId.get(item.id);
    if (!meta) continue;
    results.push({
      ...meta,
      hybridScore: item.score,
      finalRank: index + 1,
    });
  }

  return results;
}
