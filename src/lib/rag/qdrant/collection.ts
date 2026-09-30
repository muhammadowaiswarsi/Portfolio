/**
 * Explicit Qdrant collection management.
 * Never called from normal /api/chat requests.
 */

import {
  getQdrantClient,
  toQdrantError,
  QdrantClientError,
} from "@/lib/rag/qdrant/client";
import {
  getQdrantConfig,
  QDRANT_PAYLOAD_INDEX_FIELDS,
  requireVectorSize,
  type QdrantRagConfig,
} from "@/lib/rag/qdrant/config";

export type CollectionSummary = {
  name: string;
  exists: boolean;
  pointsCount?: number;
  vectorsCount?: number;
  status?: string;
  vectorSize?: number;
  distance?: string;
};

export async function collectionExists(
  config: QdrantRagConfig = getQdrantConfig(),
): Promise<boolean> {
  try {
    const client = getQdrantClient(config);
    const result = await client.collectionExists(config.collection);
    return Boolean(result.exists);
  } catch (error) {
    throw toQdrantError(error);
  }
}

export async function getCollectionSummary(
  config: QdrantRagConfig = getQdrantConfig(),
): Promise<CollectionSummary> {
  try {
    const client = getQdrantClient(config);
    const exists = await client.collectionExists(config.collection);

    if (!exists.exists) {
      return {
        name: config.collection,
        exists: false,
      };
    }

    const info = await client.getCollection(config.collection);
    const vectors = info.config?.params?.vectors;
    let vectorSize: number | undefined;
    let distance: string | undefined;

    if (vectors && typeof vectors === "object" && "size" in vectors) {
      const sized = vectors as { size?: number; distance?: string };
      vectorSize = sized.size;
      distance = sized.distance;
    }

    return {
      name: config.collection,
      exists: true,
      pointsCount: info.points_count ?? undefined,
      vectorsCount: info.indexed_vectors_count ?? undefined,
      status: info.status,
      vectorSize,
      distance,
    };
  } catch (error) {
    throw toQdrantError(error);
  }
}

export type EnsureCollectionResult = {
  created: boolean;
  collection: CollectionSummary;
  indexes: string[];
};

/**
 * Creates the knowledge collection only when it does not already exist.
 * Does not delete or recreate existing collections.
 */
export async function ensureCollection(
  config: QdrantRagConfig = getQdrantConfig(),
): Promise<EnsureCollectionResult> {
  const vectorSize = requireVectorSize(config);
  const client = getQdrantClient(config);

  try {
    const exists = await client.collectionExists(config.collection);

    if (!exists.exists) {
      await client.createCollection(config.collection, {
        vectors: {
          size: vectorSize,
          distance: config.distance,
        },
      });
    }

    const indexes = await ensurePayloadIndexes(config);
    const collection = await getCollectionSummary(config);

    return {
      created: !exists.exists,
      collection,
      indexes,
    };
  } catch (error) {
    if (error instanceof QdrantClientError) throw error;
    throw toQdrantError(error);
  }
}

/**
 * Creates a small set of keyword payload indexes for future filtering.
 * Safe to call repeatedly — existing indexes are skipped.
 */
export async function ensurePayloadIndexes(
  config: QdrantRagConfig = getQdrantConfig(),
): Promise<string[]> {
  const client = getQdrantClient(config);
  const ensured: string[] = [];

  try {
    const exists = await client.collectionExists(config.collection);
    if (!exists.exists) {
      throw new QdrantClientError(
        `Qdrant collection "${config.collection}" does not exist.`,
        "COLLECTION_MISSING",
        404,
      );
    }

    for (const field of QDRANT_PAYLOAD_INDEX_FIELDS) {
      try {
        await client.createPayloadIndex(config.collection, {
          field_name: field,
          field_schema: "keyword",
          wait: true,
        });
        ensured.push(field);
      } catch (error) {
        const message =
          error && typeof error === "object" && "message" in error
            ? String((error as { message?: unknown }).message ?? "")
            : "";

        // Already indexed — treat as success without leaking details.
        if (/already exists|Duplicate|Conflict|409/i.test(message)) {
          ensured.push(field);
          continue;
        }

        // Some Qdrant versions return structured status instead of message.
        const status =
          error && typeof error === "object" && "status" in error
            ? (error as { status?: number }).status
            : undefined;
        if (status === 409) {
          ensured.push(field);
          continue;
        }

        throw toQdrantError(error);
      }
    }

    return ensured;
  } catch (error) {
    if (error instanceof QdrantClientError) throw error;
    throw toQdrantError(error);
  }
}
