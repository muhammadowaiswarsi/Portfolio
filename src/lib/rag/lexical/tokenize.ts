/**
 * Conservative tokenization for BM25 over Computing Yard knowledge chunks.
 * Avoids aggressive stemming so product/service names stay intact.
 */

/** Very small English stop set — never remove domain terms like seo, app, web, ai. */
const STOPWORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "am",
  "to",
  "of",
  "in",
  "on",
  "at",
  "by",
  "for",
  "with",
  "as",
  "and",
  "or",
  "but",
  "if",
  "then",
  "than",
  "that",
  "this",
  "these",
  "those",
  "it",
  "its",
  "from",
  "into",
  "about",
  "over",
  "under",
  "again",
  "further",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "too",
  "very",
  "can",
  "will",
  "just",
  "don",
  "should",
  "now",
  "you",
  "your",
  "we",
  "our",
  "they",
  "them",
  "their",
  "what",
  "which",
  "who",
  "whom",
  "do",
  "does",
  "did",
  "doing",
  "have",
  "has",
  "had",
  "having",
  "i",
  "me",
  "my",
  "myself",
]);

/**
 * Lowercase, split on punctuation/whitespace, keep alphanumeric tokens.
 * Also emits compacted forms for dotted tech names (next.js → nextjs).
 */
export function tokenize(text: string): string[] {
  if (!text) return [];

  const lower = text.toLowerCase().normalize("NFKC");
  const raw = lower.match(/[a-z0-9][a-z0-9+#.]*/g) ?? [];
  const tokens: string[] = [];

  for (const token of raw) {
    const cleaned = token.replace(/^[.#+]+|[.#+]+$/g, "");
    if (!cleaned) continue;

    const parts = cleaned.split(/[.#]+/).filter(Boolean);
    for (const part of parts) {
      if (part.length < 2 && !/^\d+$/.test(part)) continue;
      if (STOPWORDS.has(part)) continue;
      tokens.push(part);
    }

    if (parts.length > 1) {
      const joined = parts.join("");
      if (joined.length >= 2 && !STOPWORDS.has(joined)) {
        tokens.push(joined);
      }
    }
  }

  return tokens;
}

export function preprocessQuery(query: string): string {
  return query.trim().replace(/\s+/g, " ");
}
