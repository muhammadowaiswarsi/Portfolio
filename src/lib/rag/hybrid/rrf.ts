/**
 * Reciprocal Rank Fusion (Cormack et al.).
 * score = Σ 1 / (k + rank)  with rank starting at 1.
 */

export type RankedListItem = {
  id: string;
};

export type RrfFusedItem = {
  id: string;
  score: number;
  ranks: Record<string, number>;
};

export function reciprocalRankFusion(
  lists: Array<{ name: string; items: RankedListItem[] }>,
  k: number,
): RrfFusedItem[] {
  const scores = new Map<string, RrfFusedItem>();

  for (const list of lists) {
    for (const [index, item] of list.items.entries()) {
      const rank = index + 1;
      const contribution = 1 / (k + rank);
      const existing = scores.get(item.id);
      if (existing) {
        existing.score += contribution;
        existing.ranks[list.name] = rank;
      } else {
        scores.set(item.id, {
          id: item.id,
          score: contribution,
          ranks: { [list.name]: rank },
        });
      }
    }
  }

  return [...scores.values()].sort(
    (a, b) => b.score - a.score || a.id.localeCompare(b.id),
  );
}
