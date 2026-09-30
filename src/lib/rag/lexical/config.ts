/**
 * Server-only lexical retrieval configuration.
 */

import { RagConfigError } from "@/lib/rag/qdrant/config";

function firstEnv(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

export const DEFAULT_LEXICAL_LIMIT = 8;

export type LexicalRetrievalConfig = {
  limit: number;
};

export function getLexicalRetrievalConfig(): LexicalRetrievalConfig {
  const limitRaw = firstEnv("RAG_LEXICAL_LIMIT");
  const limit = limitRaw
    ? Number.parseInt(limitRaw, 10)
    : DEFAULT_LEXICAL_LIMIT;

  if (!Number.isFinite(limit) || limit <= 0 || limit > 50) {
    throw new RagConfigError(
      "RAG_LEXICAL_LIMIT must be an integer between 1 and 50.",
      "INVALID_LEXICAL_LIMIT",
    );
  }

  return { limit };
}
