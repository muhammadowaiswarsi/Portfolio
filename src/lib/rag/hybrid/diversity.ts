/**
 * Lightweight per-document diversity for final context selection.
 */

import type { HybridSearchResult } from "@/lib/rag/types";

/**
 * Keep ranking order, but cap how many chunks can come from one documentId.
 */
export function applyDocumentDiversity(
  candidates: HybridSearchResult[],
  maxChunksPerDocument: number,
): HybridSearchResult[] {
  if (maxChunksPerDocument <= 0) return [...candidates];

  const counts = new Map<string, number>();
  const selected: HybridSearchResult[] = [];

  for (const candidate of candidates) {
    const used = counts.get(candidate.documentId) ?? 0;
    if (used >= maxChunksPerDocument) continue;
    counts.set(candidate.documentId, used + 1);
    selected.push(candidate);
  }

  return selected;
}
