import type { IndexDocument, KnowledgeChunk } from "@/lib/rag/types";

/**
 * Approximate ~4 characters per token for English prose.
 * Target: ~500 tokens/chunk with ~75 token overlap.
 */
const TARGET_CHARS = 2000;
const OVERLAP_CHARS = 300;
const MIN_CHUNK_CHARS = 120;

function slugifySection(section: string | undefined) {
  const value = (section || "content")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return value || "content";
}

function splitParagraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function splitSentences(text: string) {
  const parts = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  if (!parts) return [text];
  return parts.map((part) => part.trim()).filter(Boolean);
}

function buildUnits(text: string) {
  const paragraphs = splitParagraphs(text);
  const units: string[] = [];

  for (const paragraph of paragraphs) {
    if (paragraph.length <= TARGET_CHARS) {
      units.push(paragraph);
      continue;
    }

    const sentences = splitSentences(paragraph);
    let current = "";
    for (const sentence of sentences) {
      const next = current ? `${current} ${sentence}` : sentence;
      if (next.length > TARGET_CHARS && current) {
        units.push(current);
        current = sentence;
      } else {
        current = next;
      }
    }
    if (current) units.push(current);
  }

  return units;
}

function withOverlap(previous: string, next: string) {
  if (!previous || OVERLAP_CHARS <= 0) return next;
  const overlap = previous.slice(Math.max(0, previous.length - OVERLAP_CHARS)).trim();
  if (!overlap) return next;
  if (next.startsWith(overlap)) return next;
  return `${overlap}\n\n${next}`;
}

export function chunkIndexDocuments(documents: IndexDocument[]): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  for (const document of documents) {
    const units = buildUnits(document.text);
    const sectionKey = slugifySection(document.section);
    let buffer = "";
    let chunkIndex = 0;

    const flush = (force = false) => {
      const text = buffer.trim();
      if (!text) return;
      if (!force && text.length < MIN_CHUNK_CHARS && chunkIndex > 0) {
        return;
      }

      chunks.push({
        id: `${document.documentId}:${sectionKey}:${chunkIndex}`,
        documentId: document.documentId,
        documentType: document.documentType,
        title: document.title,
        text,
        slug: document.slug,
        url: document.url,
        section: document.section,
        source: document.source,
        publishedAt: document.publishedAt,
        chunkIndex,
      });
      chunkIndex += 1;
      buffer = "";
    };

    for (const unit of units) {
      const candidate = buffer ? `${buffer}\n\n${unit}` : unit;
      if (candidate.length > TARGET_CHARS && buffer) {
        const previous = buffer;
        flush(true);
        buffer = withOverlap(previous, unit);
      } else {
        buffer = candidate;
      }
    }

    flush(true);
  }

  return chunks;
}
