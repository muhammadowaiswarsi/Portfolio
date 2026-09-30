export { chunkIndexDocuments } from "@/lib/rag/indexing/chunk";
export { normalizeIndexingCatalog } from "@/lib/rag/indexing/normalize";
export { fetchSanityIndexingCatalog } from "@/lib/rag/indexing/sanity";
export {
  countCollectionPoints,
  pointIdFromChunkId,
  STALE_CLEANUP_NOTES,
  toVectorPayload,
  upsertEmbeddedChunks,
} from "@/lib/rag/indexing/upsert";
export {
  formatIndexingReport,
  runRagIndexing,
  type IndexingOptions,
  type IndexingReport,
} from "@/lib/rag/indexing/pipeline";
