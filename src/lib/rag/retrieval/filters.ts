/**
 * Build Qdrant payload filters for semantic search.
 * Filtering happens in Qdrant — never fetch-all then filter in JS.
 */

import type { Schemas } from "@qdrant/js-client-rest";

import type { SemanticSearchFilters } from "@/lib/rag/types";

type FieldCondition = Schemas["FieldCondition"];
type Filter = Schemas["Filter"];

function asList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value])
    .map((item) => item.trim())
    .filter(Boolean);
}

function matchCondition(key: string, values: string[]): FieldCondition | null {
  if (values.length === 0) return null;
  if (values.length === 1) {
    return { key, match: { value: values[0]! } };
  }
  return { key, match: { any: values } };
}

/**
 * Converts high-level retrieval filters into a Qdrant Filter.
 * Returns undefined when no filters are active.
 */
export function buildQdrantFilter(
  filters?: SemanticSearchFilters,
): Filter | undefined {
  if (!filters) return undefined;

  const must: FieldCondition[] = [];

  const documentTypes = asList(filters.documentType);
  const documentTypeCondition = matchCondition("documentType", documentTypes);
  if (documentTypeCondition) must.push(documentTypeCondition);

  const sources = asList(filters.source);
  const sourceCondition = matchCondition("source", sources);
  if (sourceCondition) must.push(sourceCondition);

  const documentIds = asList(filters.documentId);
  const documentIdCondition = matchCondition("documentId", documentIds);
  if (documentIdCondition) must.push(documentIdCondition);

  const slugs = asList(filters.slug);
  const slugCondition = matchCondition("slug", slugs);
  if (slugCondition) must.push(slugCondition);

  if (must.length === 0) return undefined;
  return { must };
}
