/**
 * BM25 lexical search over the persisted corpus.
 * Same chunk IDs as Qdrant points (deterministic UUIDs).
 */

import { Bm25Index } from "@/lib/rag/lexical/bm25";
import {
  getLexicalRetrievalConfig,
  type LexicalRetrievalConfig,
} from "@/lib/rag/lexical/config";
import {
  entrySearchText,
  readLexicalCorpus,
  type LexicalCorpusEntry,
} from "@/lib/rag/lexical/corpus";
import { preprocessQuery } from "@/lib/rag/lexical/tokenize";
import type {
  LexicalSearchResult,
  SemanticSearchFilters,
} from "@/lib/rag/types";

export class LexicalSearchError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "LexicalSearchError";
    this.code = code;
  }
}

type CachedIndex = {
  index: Bm25Index;
  byId: Map<string, LexicalCorpusEntry>;
  mtimeKey: string;
};

let cache: CachedIndex | null = null;

function matchesFilters(
  entry: LexicalCorpusEntry,
  filters?: SemanticSearchFilters,
) {
  if (!filters) return true;

  const types = filters.documentType
    ? Array.isArray(filters.documentType)
      ? filters.documentType
      : [filters.documentType]
    : null;
  if (types && !types.includes(entry.documentType)) return false;

  const sources = filters.source
    ? Array.isArray(filters.source)
      ? filters.source
      : [filters.source]
    : null;
  if (sources && !sources.includes(entry.source)) return false;

  const documentIds = filters.documentId
    ? Array.isArray(filters.documentId)
      ? filters.documentId
      : [filters.documentId]
    : null;
  if (documentIds && !documentIds.includes(entry.documentId)) return false;

  const slugs = filters.slug
    ? Array.isArray(filters.slug)
      ? filters.slug
      : [filters.slug]
    : null;
  if (slugs && (!entry.slug || !slugs.includes(entry.slug))) return false;

  return true;
}

async function loadIndex(): Promise<CachedIndex> {
  const corpus = await readLexicalCorpus();
  const mtimeKey = `${corpus.generatedAt}:${corpus.chunkCount}`;
  if (cache && cache.mtimeKey === mtimeKey) return cache;

  const byId = new Map<string, LexicalCorpusEntry>();
  const documents = corpus.entries.map((entry) => {
    byId.set(entry.id, entry);
    return {
      id: entry.id,
      searchText: entrySearchText(entry),
    };
  });

  const index = new Bm25Index(documents);
  cache = { index, byId, mtimeKey };
  return cache;
}

/** Test helper — clears the in-memory BM25 cache. */
export function resetLexicalIndexCache() {
  cache = null;
}

export type LexicalSearchOptions = {
  limit?: number;
  filters?: SemanticSearchFilters;
};

export async function lexicalSearch(
  query: string,
  options?: LexicalSearchOptions,
): Promise<LexicalSearchResult[]> {
  const started = Date.now();
  const cleaned = preprocessQuery(query);
  if (!cleaned) {
    throw new LexicalSearchError(
      "Lexical search query must not be empty.",
      "EMPTY_QUERY",
    );
  }

  let config: LexicalRetrievalConfig;
  try {
    config = getLexicalRetrievalConfig();
  } catch (error) {
    throw new LexicalSearchError(
      error instanceof Error ? error.message : "Invalid lexical config.",
      "INVALID_CONFIG",
    );
  }

  const limit =
    options?.limit !== undefined ? Math.trunc(options.limit) : config.limit;
  if (!Number.isFinite(limit) || limit <= 0 || limit > 50) {
    throw new LexicalSearchError(
      "Lexical search limit must be an integer between 1 and 50.",
      "INVALID_LIMIT",
    );
  }

  let loaded: CachedIndex;
  try {
    loaded = await loadIndex();
  } catch (error) {
    throw new LexicalSearchError(
      error instanceof Error
        ? error.message
        : "Lexical corpus is unavailable.",
      "CORPUS_UNAVAILABLE",
    );
  }

  // Over-fetch when filters are active so we can still fill the limit.
  const fetchLimit = options?.filters ? Math.min(50, limit * 4) : limit;
  const hits = loaded.index.search(cleaned, fetchLimit);

  const results: LexicalSearchResult[] = [];
  for (const hit of hits) {
    const entry = loaded.byId.get(hit.id);
    if (!entry) continue;
    if (!matchesFilters(entry, options?.filters)) continue;

    results.push({
      id: entry.id,
      score: hit.score,
      text: entry.text,
      documentId: entry.documentId,
      documentType: entry.documentType,
      title: entry.title,
      slug: entry.slug,
      url: entry.url,
      section: entry.section,
      chunkIndex: entry.chunkIndex,
      source: entry.source,
      publishedAt: entry.publishedAt,
      chunkId: entry.chunkId,
    });

    if (results.length >= limit) break;
  }

  console.info("Lexical search completed.", {
    queryLength: cleaned.length,
    resultCount: results.length,
    limit,
    corpusSize: loaded.index.size,
    latencyMs: Date.now() - started,
  });

  return results;
}
