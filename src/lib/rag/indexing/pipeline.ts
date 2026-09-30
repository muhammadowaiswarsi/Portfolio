import { chunkIndexDocuments } from "@/lib/rag/indexing/chunk";
import { normalizeIndexingCatalog } from "@/lib/rag/indexing/normalize";
import { fetchSanityIndexingCatalog } from "@/lib/rag/indexing/sanity";
import {
  countCollectionPoints,
  STALE_CLEANUP_NOTES,
  upsertEmbeddedChunks,
} from "@/lib/rag/indexing/upsert";
import {
  getEmbeddingProvider,
  type EmbeddingProvider,
} from "@/lib/rag/embeddings";
import {
  LEXICAL_CORPUS_RELATIVE_PATH,
  resetLexicalIndexCache,
  writeLexicalCorpus,
} from "@/lib/rag/lexical";
import { getCollectionSummary } from "@/lib/rag/qdrant/collection";
import { requireVectorSize, getQdrantConfig } from "@/lib/rag/qdrant/config";

export type IndexingOptions = {
  dryRun?: boolean;
  embedder?: EmbeddingProvider;
};

export type IndexingReport = {
  dryRun: boolean;
  fetched: {
    services: number;
    projects: number;
    blogs: number;
    testimonials: number;
  };
  normalizedSections: number;
  byType: Record<string, number>;
  chunks: number;
  embeddings: number;
  upserted: number;
  lexicalCorpusChunks?: number;
  pointsBefore?: number;
  pointsAfter?: number;
  embeddingModel?: string;
  vectorSize: number;
  collection: string;
  failures: number;
  notes: string[];
};

function countByType(
  items: Array<{ documentType: string }>,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.documentType] = (counts[item.documentType] ?? 0) + 1;
  }
  return counts;
}

export async function runRagIndexing(
  options: IndexingOptions = {},
): Promise<IndexingReport> {
  const dryRun = Boolean(options.dryRun);
  const notes: string[] = [
    "Live chatbot still uses Sanity keyword retrieval — RAG retrieval is not wired to /api/chat yet.",
    STALE_CLEANUP_NOTES,
  ];

  const qdrant = getQdrantConfig();
  const vectorSize = requireVectorSize(qdrant);

  const catalog = await fetchSanityIndexingCatalog();
  const normalized = normalizeIndexingCatalog(catalog);
  const chunks = chunkIndexDocuments(normalized.documents);

  const report: IndexingReport = {
    dryRun,
    fetched: {
      services: catalog.services?.length ?? 0,
      projects: catalog.projects?.length ?? 0,
      blogs: catalog.blogs?.length ?? 0,
      testimonials: catalog.testimonials?.length ?? 0,
    },
    normalizedSections: normalized.documents.length,
    byType: countByType(normalized.documents),
    chunks: chunks.length,
    embeddings: 0,
    upserted: 0,
    vectorSize,
    collection: qdrant.collection,
    failures: 0,
    notes,
  };

  if (chunks.length === 0) {
    notes.push("No chunks produced from Sanity/static sources.");
    return report;
  }

  if (dryRun) {
    try {
      const embedder = options.embedder ?? getEmbeddingProvider();
      report.embeddingModel = embedder.model;
      if (embedder.dimensions !== vectorSize) {
        throw new Error(
          `Embedding dimensions (${embedder.dimensions}) do not match RAG_VECTOR_SIZE (${vectorSize}).`,
        );
      }
      notes.push(
        `Dry run complete: Sanity fetch, normalize, chunk, and embedding config validated. Lexical corpus at ${LEXICAL_CORPUS_RELATIVE_PATH} is not written during dry-run.`,
      );
    } catch (error) {
      report.failures += 1;
      notes.push(
        error instanceof Error
          ? `Dry-run embedding config check failed: ${error.message}`
          : "Dry-run embedding config check failed.",
      );
    }
    return report;
  }

  const embedder = options.embedder ?? getEmbeddingProvider();
  report.embeddingModel = embedder.model;

  if (embedder.dimensions !== vectorSize) {
    report.failures += 1;
    notes.push(
      `Embedding dimensions (${embedder.dimensions}) do not match RAG_VECTOR_SIZE (${vectorSize}).`,
    );
    return report;
  }

  const collection = await getCollectionSummary(qdrant);
  if (!collection.exists) {
    report.failures += 1;
    notes.push(
      `Qdrant collection "${qdrant.collection}" does not exist. Create it before indexing.`,
    );
    return report;
  }

  report.pointsBefore = await countCollectionPoints();

  try {
    const lexical = await writeLexicalCorpus(chunks);
    report.lexicalCorpusChunks = lexical.chunkCount;
    resetLexicalIndexCache();
    notes.push(
      `Lexical BM25 corpus written (${lexical.chunkCount} chunks) → ${LEXICAL_CORPUS_RELATIVE_PATH}`,
    );
  } catch (error) {
    report.failures += 1;
    notes.push(
      error instanceof Error
        ? `Lexical corpus write failed: ${error.message}`
        : "Lexical corpus write failed.",
    );
    return report;
  }

  const texts = chunks.map((chunk) => chunk.text);
  const vectors = await embedder.embedTexts(texts);

  if (vectors.length !== chunks.length) {
    report.failures += 1;
    notes.push(
      `Embedding count mismatch: expected ${chunks.length}, got ${vectors.length}.`,
    );
    return report;
  }

  for (const [index, vector] of vectors.entries()) {
    if (vector.length !== vectorSize) {
      report.failures += 1;
      notes.push(
        `Vector dimension mismatch at chunk ${index}: expected ${vectorSize}, got ${vector.length}. Aborting upsert.`,
      );
      return report;
    }
  }

  report.embeddings = vectors.length;

  const upserted = await upsertEmbeddedChunks(
    chunks.map((chunk, index) => ({
      chunk,
      vector: vectors[index]!,
    })),
  );

  report.upserted = upserted;
  report.pointsAfter = await countCollectionPoints();
  report.byType = countByType(chunks);

  notes.push(
    "Indexing upsert complete. Re-running should update the same deterministic point IDs without duplicating points.",
  );

  return report;
}

export function formatIndexingReport(report: IndexingReport) {
  const lines = [
    report.dryRun ? "RAG index dry-run report" : "RAG index report",
    `Collection: ${report.collection}`,
    `Vector size: ${report.vectorSize}`,
    report.embeddingModel ? `Embedding model: ${report.embeddingModel}` : null,
    "",
    `Documents fetched: services=${report.fetched.services}, projects=${report.fetched.projects}, blogs=${report.fetched.blogs}, testimonials=${report.fetched.testimonials}`,
    `Normalized sections: ${report.normalizedSections}`,
    `Chunks created: ${report.chunks}`,
    `Embeddings generated: ${report.embeddings}`,
    `Points upserted: ${report.upserted}`,
    typeof report.lexicalCorpusChunks === "number"
      ? `Lexical corpus chunks: ${report.lexicalCorpusChunks}`
      : null,
    typeof report.pointsBefore === "number"
      ? `Qdrant points before: ${report.pointsBefore}`
      : null,
    typeof report.pointsAfter === "number"
      ? `Qdrant points after: ${report.pointsAfter}`
      : null,
    `Failures: ${report.failures}`,
    "",
    "By type:",
    ...Object.entries(report.byType)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([type, count]) => `  ${type}: ${count}`),
    "",
    "Notes:",
    ...report.notes.map((note) => `  - ${note}`),
  ].filter((line): line is string => line !== null);

  return lines.join("\n");
}
