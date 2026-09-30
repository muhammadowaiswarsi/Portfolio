/**
 * Normalize Qdrant scored points into SemanticSearchResult.
 * Malformed payloads are skipped — never crash the whole search.
 */

import type {
  RagDocumentType,
  RagSource,
  SemanticSearchResult,
} from "@/lib/rag/types";

const DOCUMENT_TYPES = new Set<RagDocumentType>([
  "company",
  "service",
  "project",
  "blog",
  "faq",
  "technology",
  "testimonial",
  "process",
]);

const SOURCES = new Set<RagSource>(["sanity", "static", "manual"]);

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function asFiniteNumber(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return value;
}

function asDocumentType(value: unknown): RagDocumentType | undefined {
  const text = asNonEmptyString(value);
  if (!text) return undefined;
  return DOCUMENT_TYPES.has(text as RagDocumentType)
    ? (text as RagDocumentType)
    : undefined;
}

function asSource(value: unknown): RagSource | undefined {
  const text = asNonEmptyString(value);
  if (!text) return undefined;
  return SOURCES.has(text as RagSource) ? (text as RagSource) : undefined;
}

export type RawScoredPoint = {
  id: string | number;
  score: number;
  payload?: Record<string, unknown> | null;
};

/**
 * Convert a single Qdrant hit. Returns null when required fields are missing.
 */
export function normalizeScoredPoint(
  point: RawScoredPoint,
): SemanticSearchResult | null {
  const score = asFiniteNumber(point.score);
  if (score === undefined) {
    console.warn("Semantic search skipped point: invalid score.", {
      pointId: String(point.id),
    });
    return null;
  }

  const payload = point.payload;
  if (!payload || typeof payload !== "object") {
    console.warn("Semantic search skipped point: missing payload.", {
      pointId: String(point.id),
    });
    return null;
  }

  const text = asNonEmptyString(payload.text);
  const documentId = asNonEmptyString(payload.documentId);
  const documentType = asDocumentType(payload.documentType);
  const title = asNonEmptyString(payload.title);

  if (!text || !documentId || !documentType || !title) {
    console.warn("Semantic search skipped point: incomplete payload.", {
      pointId: String(point.id),
      hasText: Boolean(text),
      hasDocumentId: Boolean(documentId),
      hasDocumentType: Boolean(documentType),
      hasTitle: Boolean(title),
    });
    return null;
  }

  const chunkIndex = asFiniteNumber(payload.chunkIndex);
  const result: SemanticSearchResult = {
    id: String(point.id),
    score,
    text,
    documentId,
    documentType,
    title,
  };

  const slug = asNonEmptyString(payload.slug);
  if (slug) result.slug = slug;

  const url = asNonEmptyString(payload.url);
  if (url) result.url = url;

  const section = asNonEmptyString(payload.section);
  if (section) result.section = section;

  if (chunkIndex !== undefined) result.chunkIndex = Math.trunc(chunkIndex);

  const source = asSource(payload.source);
  if (source) result.source = source;

  const publishedAt = asNonEmptyString(payload.publishedAt);
  if (publishedAt) result.publishedAt = publishedAt;

  const chunkId = asNonEmptyString(payload.chunkId);
  if (chunkId) result.chunkId = chunkId;

  return result;
}

export function normalizeScoredPoints(
  points: RawScoredPoint[],
): SemanticSearchResult[] {
  const results: SemanticSearchResult[] = [];
  for (const point of points) {
    const normalized = normalizeScoredPoint(point);
    if (normalized) results.push(normalized);
  }
  return results;
}
