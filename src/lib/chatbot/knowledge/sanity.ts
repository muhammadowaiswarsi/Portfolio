import { sanityFetch } from "@/sanity/lib/client";

import { KNOWLEDGE_LIMITS, type KnowledgeDocument, type KnowledgeSearchResult } from "@/lib/chatbot/types";
import {
  documentsFromCatalog,
  type SanityKnowledgeCatalog,
} from "@/lib/chatbot/knowledge/normalize";
import { chatbotKnowledgeCatalogQuery } from "@/lib/chatbot/knowledge/queries";
import {
  detectIntentBoosts,
  isSmallTalk,
  primaryIntent,
  scoreDocument,
  titleMatchScore,
  tokenize,
} from "@/lib/chatbot/knowledge/score";
import { FALLBACK_DOCUMENTS } from "@/lib/chatbot/knowledge/static";


type CatalogCache = {
  documents: KnowledgeDocument[];
  expiresAt: number;
};

let catalogCache: CatalogCache | null = null;

async function loadSanityDocuments(): Promise<KnowledgeDocument[]> {
  const now = Date.now();
  if (catalogCache && catalogCache.expiresAt > now) {
    return catalogCache.documents;
  }

  const catalog = await sanityFetch<SanityKnowledgeCatalog>(
    chatbotKnowledgeCatalogQuery,
  );
  const documents = documentsFromCatalog(catalog ?? {});
  catalogCache = {
    documents,
    expiresAt: now + KNOWLEDGE_LIMITS.catalogTtlMs,
  };
  return documents;
}

function toSearchResult(
  document: KnowledgeDocument & { score: number; titleScore: number },
): KnowledgeSearchResult {
  return {
    id: document.id,
    title: document.title,
    kind: document.kind,
    content: document.content,
    url: document.url,
    metadata: document.metadata,
    score: document.score,
  };
}

function rankDocuments(
  documents: KnowledgeDocument[],
  query: string,
  limit: number,
): KnowledgeSearchResult[] {
  const terms = tokenize(query);
  const boosts = detectIntentBoosts(query);
  const intent = primaryIntent(boosts);

  const scored = documents
    .map((document) => ({
      ...document,
      score: scoreDocument(document, terms, boosts),
      titleScore: titleMatchScore(document.title, terms),
    }))
    .sort((a, b) => b.score - a.score);

  const specific = scored
    .filter((document) => document.titleScore >= 8)
    .slice(0, limit);

  if (specific.length > 0) {
    return specific.map(toSearchResult);
  }

  if (intent) {
    return scored
      .filter((document) => document.kind === intent)
      .slice(0, limit)
      .map(toSearchResult);
  }

  return scored
    .filter((document) => document.score >= 6)
    .slice(0, limit)
    .map(toSearchResult);
}

export function createSanityKnowledgeProvider() {
  return {
    async search(
      query: string,
      limit = KNOWLEDGE_LIMITS.maxResults,
    ): Promise<KnowledgeSearchResult[]> {
      if (isSmallTalk(query)) return [];

      let cmsDocuments: KnowledgeDocument[] = [];

      try {
        cmsDocuments = await loadSanityDocuments();
      } catch {
        console.error("Chat knowledge catalog failed.");
        return rankDocuments(FALLBACK_DOCUMENTS, query, limit);
      }

      const ranked = rankDocuments(
        [...cmsDocuments, ...FALLBACK_DOCUMENTS],
        query,
        limit,
      );

      if (ranked.length > 0) return ranked;

      return rankDocuments(FALLBACK_DOCUMENTS, query, Math.min(2, limit));
    },
  };
}
