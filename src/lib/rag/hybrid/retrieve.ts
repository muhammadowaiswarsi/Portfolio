/**
 * Hybrid retrieval orchestration (Phase 8).
 *
 * Query → preprocess
 * → semantic (Qdrant) + lexical (BM25)
 * → RRF fusion → optional rerank → diversity/context select
 *
 * Does NOT call the chat LLM or /api/chat.
 */

import { fuseHybridCandidates } from "@/lib/rag/hybrid/fuse";
import { getHybridRetrievalConfig } from "@/lib/rag/hybrid/config";
import { selectContext } from "@/lib/rag/hybrid/select";
import {
  LexicalSearchError,
  lexicalSearch,
  preprocessQuery,
} from "@/lib/rag/lexical";
import { getLexicalRetrievalConfig } from "@/lib/rag/lexical/config";
import { getSemanticRetrievalConfig } from "@/lib/rag/retrieval/config";
import { SemanticSearchError } from "@/lib/rag/retrieval/errors";
import { semanticSearch } from "@/lib/rag/retrieval/search";
import { rerankHybridCandidates } from "@/lib/rag/reranking";
import type {
  HybridSearchMode,
  HybridSearchOptions,
  HybridSearchResult,
  LexicalSearchResult,
  RetrievePipelineResult,
  SemanticSearchResult,
} from "@/lib/rag/types";

export class HybridRetrievalError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "HybridRetrievalError";
    this.code = code;
  }
}

function resolveMode(mode?: HybridSearchMode): HybridSearchMode {
  return mode ?? "hybrid";
}

function toHybridFromSemantic(
  results: SemanticSearchResult[],
): HybridSearchResult[] {
  return results.map((result, index) => ({
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
    hybridScore: result.score,
    finalRank: index + 1,
  }));
}

function toHybridFromLexical(
  results: LexicalSearchResult[],
): HybridSearchResult[] {
  return results.map((result, index) => ({
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
    hybridScore: result.score,
    finalRank: index + 1,
  }));
}

/**
 * Full retrieval pipeline with stage diagnostics.
 * Safe for CLI evaluation — not wired to the live chatbot.
 */
export async function retrieve(
  query: string,
  options: HybridSearchOptions = {},
): Promise<RetrievePipelineResult> {
  const started = Date.now();
  const notes: string[] = [];
  const mode = resolveMode(options.mode);
  const cleaned = preprocessQuery(query);

  if (!cleaned) {
    throw new HybridRetrievalError(
      "Retrieval query must not be empty.",
      "EMPTY_QUERY",
    );
  }

  const semanticConfig = getSemanticRetrievalConfig();
  const lexicalConfig = getLexicalRetrievalConfig();
  const hybridConfig = getHybridRetrievalConfig();

  const semanticLimit = options.semanticLimit ?? semanticConfig.limit;
  const lexicalLimit = options.lexicalLimit ?? lexicalConfig.limit;
  const hybridCandidateLimit =
    options.hybridCandidateLimit ?? hybridConfig.hybridCandidateLimit;
  const contextLimit = options.contextLimit ?? hybridConfig.contextLimit;
  const maxChunksPerDocument =
    options.maxChunksPerDocument ?? hybridConfig.maxChunksPerDocument;
  const rrfK = options.rrfK ?? hybridConfig.rrfK;
  const wantRerank = options.rerank !== false;

  let semantic: SemanticSearchResult[] = [];
  let lexical: LexicalSearchResult[] = [];
  let semanticFailed = false;
  let lexicalFailed = false;

  const runSemantic = mode === "semantic" || mode === "hybrid";
  const runLexical = mode === "lexical" || mode === "hybrid";

  if (runSemantic) {
    try {
      semantic = await semanticSearch(cleaned, {
        limit: semanticLimit,
        scoreThreshold: options.scoreThreshold,
        filters: options.filters,
      });
    } catch (error) {
      semanticFailed = true;
      const message =
        error instanceof SemanticSearchError
          ? error.message
          : "Semantic retrieval failed.";
      notes.push(`Semantic stage failed: ${message}`);
      if (mode === "semantic") {
        throw new HybridRetrievalError(message, "SEMANTIC_FAILED");
      }
    }
  }

  if (runLexical) {
    try {
      lexical = await lexicalSearch(cleaned, {
        limit: lexicalLimit,
        filters: options.filters,
      });
    } catch (error) {
      lexicalFailed = true;
      const message =
        error instanceof LexicalSearchError
          ? error.message
          : "Lexical retrieval failed.";
      notes.push(`Lexical stage failed: ${message}`);
      if (mode === "lexical") {
        throw new HybridRetrievalError(message, "LEXICAL_FAILED");
      }
    }
  }

  if (mode === "hybrid" && semanticFailed && lexicalFailed) {
    throw new HybridRetrievalError(
      "Both semantic and lexical retrieval failed.",
      "RETRIEVAL_FAILED",
    );
  }

  let hybrid: HybridSearchResult[] = [];

  if (mode === "semantic") {
    hybrid = toHybridFromSemantic(semantic);
  } else if (mode === "lexical") {
    hybrid = toHybridFromLexical(lexical);
  } else if (semantic.length > 0 && lexical.length > 0) {
    hybrid = fuseHybridCandidates({
      semantic,
      lexical,
      rrfK,
      limit: hybridCandidateLimit,
    });
  } else if (semantic.length > 0) {
    notes.push("Hybrid fell back to semantic-only (lexical empty or failed).");
    hybrid = toHybridFromSemantic(semantic).slice(0, hybridCandidateLimit);
  } else if (lexical.length > 0) {
    notes.push("Hybrid fell back to lexical-only (semantic empty or failed).");
    hybrid = toHybridFromLexical(lexical).slice(0, hybridCandidateLimit);
  }

  let reranked = hybrid;
  let rerankApplied = false;

  if (wantRerank && hybrid.length > 0 && mode === "hybrid") {
    const rerank = await rerankHybridCandidates({
      query: cleaned,
      candidates: hybrid,
    });
    reranked = rerank.results;
    rerankApplied = rerank.applied;
    if (rerank.note) notes.push(rerank.note);
  } else if (mode !== "hybrid") {
    notes.push(`Mode "${mode}" — skipped hybrid fusion/rerank.`);
  } else if (!wantRerank) {
    notes.push("Rerank skipped by options.rerank=false.");
  }

  const context = selectContext(reranked, {
    limit: contextLimit,
    maxChunksPerDocument,
  });

  console.info("Hybrid retrieval completed.", {
    queryLength: cleaned.length,
    mode,
    semanticCount: semantic.length,
    lexicalCount: lexical.length,
    hybridCount: hybrid.length,
    rerankedCount: reranked.length,
    contextCount: context.length,
    rerankApplied,
    latencyMs: Date.now() - started,
  });

  return {
    query: cleaned,
    mode,
    semantic,
    lexical,
    hybrid,
    reranked,
    context,
    rerankApplied,
    notes,
    latencyMs: Date.now() - started,
  };
}
