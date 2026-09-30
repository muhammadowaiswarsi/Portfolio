/**
 * Persistent lexical corpus — same KnowledgeChunk set used for Qdrant.
 *
 * Location: src/lib/rag/lexical/data/corpus.json
 * Written by `npm run rag:index` (live mode).
 * Loaded at search time by the BM25 index.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

import { pointIdFromChunkId } from "@/lib/rag/indexing/upsert";
import type { KnowledgeChunk, RagDocumentType, RagSource } from "@/lib/rag/types";

export const LEXICAL_CORPUS_RELATIVE_PATH =
  "src/lib/rag/lexical/data/corpus.json";

export type LexicalCorpusEntry = {
  id: string;
  chunkId: string;
  documentId: string;
  documentType: RagDocumentType;
  title: string;
  text: string;
  slug?: string;
  url?: string;
  section?: string;
  chunkIndex: number;
  source: RagSource;
  publishedAt?: string;
};

export type LexicalCorpusFile = {
  version: 1;
  generatedAt: string;
  chunkCount: number;
  entries: LexicalCorpusEntry[];
};

export function getLexicalCorpusAbsolutePath(cwd = process.cwd()) {
  return path.join(cwd, LEXICAL_CORPUS_RELATIVE_PATH);
}

export function chunksToCorpusEntries(
  chunks: KnowledgeChunk[],
): LexicalCorpusEntry[] {
  return chunks.map((chunk) => {
    const entry: LexicalCorpusEntry = {
      id: pointIdFromChunkId(chunk.id),
      chunkId: chunk.id,
      documentId: chunk.documentId,
      documentType: chunk.documentType,
      title: chunk.title,
      text: chunk.text,
      chunkIndex: chunk.chunkIndex,
      source: chunk.source,
    };
    if (chunk.slug) entry.slug = chunk.slug;
    if (chunk.url) entry.url = chunk.url;
    if (chunk.section) entry.section = chunk.section;
    if (chunk.publishedAt) entry.publishedAt = chunk.publishedAt;
    return entry;
  });
}

export function buildCorpusFile(chunks: KnowledgeChunk[]): LexicalCorpusFile {
  const entries = chunksToCorpusEntries(chunks);
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    chunkCount: entries.length,
    entries,
  };
}

export async function writeLexicalCorpus(
  chunks: KnowledgeChunk[],
  cwd = process.cwd(),
): Promise<{ path: string; chunkCount: number }> {
  const absolute = getLexicalCorpusAbsolutePath(cwd);
  await fs.mkdir(path.dirname(absolute), { recursive: true });
  const payload = buildCorpusFile(chunks);
  await fs.writeFile(absolute, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return { path: absolute, chunkCount: payload.chunkCount };
}

export async function readLexicalCorpus(
  cwd = process.cwd(),
): Promise<LexicalCorpusFile> {
  const absolute = getLexicalCorpusAbsolutePath(cwd);
  let raw: string;
  try {
    raw = await fs.readFile(absolute, "utf8");
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code?: unknown }).code)
        : undefined;
    if (code === "ENOENT") {
      throw new Error(
        `Lexical corpus missing at ${LEXICAL_CORPUS_RELATIVE_PATH}. Run \`npm run rag:index\` to generate it.`,
      );
    }
    throw error;
  }

  const parsed = JSON.parse(raw) as LexicalCorpusFile;
  if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.entries)) {
    throw new Error(
      `Lexical corpus at ${LEXICAL_CORPUS_RELATIVE_PATH} is malformed.`,
    );
  }
  return parsed;
}

export function entrySearchText(entry: LexicalCorpusEntry) {
  return [
    entry.title,
    entry.section,
    entry.slug,
    entry.documentType,
    entry.text,
  ]
    .filter(Boolean)
    .join("\n");
}
