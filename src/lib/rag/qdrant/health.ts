/**
 * Server-only Qdrant health checks.
 * Never expose credentials, URLs, or raw Qdrant payloads to clients.
 */

import { getQdrantClient, toQdrantError } from "@/lib/rag/qdrant/client";
import {
  getQdrantConfig,
  RagConfigError,
  type QdrantRagConfig,
} from "@/lib/rag/qdrant/config";
import { getCollectionSummary } from "@/lib/rag/qdrant/collection";

export type QdrantHealthStatus = {
  ok: boolean;
  configured: boolean;
  reachable: boolean;
  collectionExists: boolean;
  collection?: string;
  pointsCount?: number;
  vectorSize?: number;
  distance?: string;
  errorCode?: string;
};

function baseStatus(
  configured: boolean,
  extras: Partial<QdrantHealthStatus> = {},
): QdrantHealthStatus {
  return {
    ok: false,
    configured,
    reachable: false,
    collectionExists: false,
    ...extras,
  };
}

/**
 * Verifies Qdrant config + connectivity without throwing.
 * Suitable for scripts and internal diagnostics.
 */
export async function checkQdrantHealth(
  config?: QdrantRagConfig,
): Promise<QdrantHealthStatus> {
  let resolved: QdrantRagConfig;

  try {
    resolved = config ?? getQdrantConfig();
  } catch (error) {
    if (error instanceof RagConfigError) {
      return baseStatus(false, { errorCode: error.code });
    }
    return baseStatus(false, { errorCode: "CONFIG_ERROR" });
  }

  try {
    const client = getQdrantClient(resolved);
    await client.getCollections();

    const summary = await getCollectionSummary(resolved);

    return {
      ok: true,
      configured: true,
      reachable: true,
      collectionExists: summary.exists,
      collection: summary.name,
      pointsCount: summary.pointsCount,
      vectorSize: summary.vectorSize,
      distance: summary.distance,
    };
  } catch (error) {
    const mapped = toQdrantError(error);
    return baseStatus(true, {
      collection: resolved.collection,
      errorCode: mapped.code,
      reachable: mapped.code !== "CONNECTION_FAILED" && mapped.code !== "CLIENT_INIT_FAILED",
    });
  }
}
