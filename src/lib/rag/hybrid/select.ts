/**
 * Select compact final context candidates for a future LLM prompt.
 * Does NOT build a prompt or generate an answer.
 */

import { applyDocumentDiversity } from "@/lib/rag/hybrid/diversity";
import type { HybridSearchResult } from "@/lib/rag/types";

export type SelectContextOptions = {
  limit: number;
  maxChunksPerDocument: number;
};

export function selectContext(
  candidates: HybridSearchResult[],
  options: SelectContextOptions,
): HybridSearchResult[] {
  const seen = new Set<string>();
  const deduped: HybridSearchResult[] = [];

  for (const candidate of candidates) {
    if (seen.has(candidate.id)) continue;
    seen.add(candidate.id);
    deduped.push(candidate);
  }

  const diversified = applyDocumentDiversity(
    deduped,
    options.maxChunksPerDocument,
  );

  return diversified.slice(0, options.limit).map((item, index) => ({
    ...item,
    finalRank: index + 1,
  }));
}
