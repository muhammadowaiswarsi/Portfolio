/**
 * Server-only Qdrant / RAG configuration.
 * Embedding dimension is explicit — never guessed.
 */

export class RagConfigError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "RagConfigError";
    this.code = code;
  }
}

export type QdrantDistance = "Cosine" | "Euclid" | "Dot";

export type QdrantRagConfig = {
  url: string;
  apiKey?: string;
  collection: string;
  vectorSize?: number;
  distance: QdrantDistance;
};

const DEFAULT_COLLECTION = "computing-yard-knowledge";
const DEFAULT_DISTANCE: QdrantDistance = "Cosine";

function firstEnv(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

function parsePositiveInt(value: string | undefined, label: string) {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new RagConfigError(
      `${label} must be a positive integer when set.`,
      "INVALID_VECTOR_SIZE",
    );
  }
  return parsed;
}

function parseDistance(value: string | undefined): QdrantDistance {
  if (!value) return DEFAULT_DISTANCE;
  const normalized = value.trim();
  if (
    normalized === "Cosine" ||
    normalized === "Euclid" ||
    normalized === "Dot"
  ) {
    return normalized;
  }
  throw new RagConfigError(
    'RAG_DISTANCE must be one of "Cosine", "Euclid", or "Dot".',
    "INVALID_DISTANCE",
  );
}

/**
 * Reads Qdrant connection settings. Does not require vector size
 * until collection creation is explicitly requested.
 */
export function getQdrantConfig(): QdrantRagConfig {
  const url = firstEnv("QDRANT_URL");
  if (!url) {
    throw new RagConfigError(
      "Missing environment variable: QDRANT_URL",
      "MISSING_URL",
    );
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("invalid protocol");
    }
  } catch {
    throw new RagConfigError(
      "QDRANT_URL is not a valid URL.",
      "INVALID_URL",
    );
  }

  const collection =
    firstEnv("QDRANT_COLLECTION") || DEFAULT_COLLECTION;
  const apiKey = firstEnv("QDRANT_API_KEY");
  const vectorSize = parsePositiveInt(
    firstEnv("RAG_VECTOR_SIZE"),
    "RAG_VECTOR_SIZE",
  );
  const distance = parseDistance(firstEnv("RAG_DISTANCE"));

  return {
    url,
    apiKey,
    collection,
    vectorSize,
    distance,
  };
}

/**
 * Vector size is required only when creating a collection.
 * Embedding model selection happens in a later phase.
 */
export function requireVectorSize(config: QdrantRagConfig): number {
  if (!config.vectorSize) {
    throw new RagConfigError(
      "Missing environment variable: RAG_VECTOR_SIZE. Set it to the embedding model dimension before creating the Qdrant collection.",
      "MISSING_VECTOR_SIZE",
    );
  }
  return config.vectorSize;
}

export const QDRANT_PAYLOAD_INDEX_FIELDS = [
  "documentType",
  "documentId",
  "slug",
  "source",
] as const;

export type QdrantPayloadIndexField =
  (typeof QDRANT_PAYLOAD_INDEX_FIELDS)[number];
