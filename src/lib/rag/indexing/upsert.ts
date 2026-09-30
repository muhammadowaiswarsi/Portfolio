import { createHash } from "node:crypto";

import { getQdrantClient, toQdrantError } from "@/lib/rag/qdrant/client";
import { getQdrantConfig } from "@/lib/rag/qdrant/config";
import type { KnowledgeChunk, VectorPointPayload } from "@/lib/rag/types";

const UPSERT_BATCH_SIZE = 64;

/**
 * Deterministic UUID derived from chunk id for idempotent Qdrant upserts.
 */
export function pointIdFromChunkId(chunkId: string) {
  const hash = createHash("sha256").update(`cy-rag:${chunkId}`).digest();
  const bytes = Buffer.from(hash.subarray(0, 16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x50;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

export function toVectorPayload(chunk: KnowledgeChunk): VectorPointPayload {
  return {
    chunkId: chunk.id,
    documentId: chunk.documentId,
    documentType: chunk.documentType,
    title: chunk.title,
    slug: chunk.slug,
    url: chunk.url,
    section: chunk.section,
    chunkIndex: chunk.chunkIndex,
    text: chunk.text,
    source: chunk.source,
    publishedAt: chunk.publishedAt,
  };
}

export type UpsertBatchInput = {
  chunk: KnowledgeChunk;
  vector: number[];
};

export async function upsertEmbeddedChunks(
  items: UpsertBatchInput[],
): Promise<number> {
  if (items.length === 0) return 0;

  const config = getQdrantConfig();
  const client = getQdrantClient(config);
  let upserted = 0;

  try {
    for (let i = 0; i < items.length; i += UPSERT_BATCH_SIZE) {
      const batch = items.slice(i, i + UPSERT_BATCH_SIZE);
      await client.upsert(config.collection, {
        wait: true,
        points: batch.map(({ chunk, vector }) => ({
          id: pointIdFromChunkId(chunk.id),
          vector,
          payload: toVectorPayload(chunk),
        })),
      });
      upserted += batch.length;
    }
    return upserted;
  } catch (error) {
    throw toQdrantError(error);
  }
}

export async function countCollectionPoints() {
  const config = getQdrantConfig();
  const client = getQdrantClient(config);
  try {
    const result = await client.count(config.collection, { exact: true });
    return result.count;
  } catch (error) {
    throw toQdrantError(error);
  }
}

/**
 * Future stale cleanup: compare payload.documentId values against the current
 * Sanity catalog document IDs, then delete only orphaned point IDs.
 * Not executed automatically in Phase 6.
 */
export const STALE_CLEANUP_NOTES =
  "Identify Qdrant points whose documentId is absent from the latest Sanity catalog, then delete those point IDs only. Never wipe the whole collection during normal indexing.";
