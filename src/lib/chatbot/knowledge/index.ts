import { KNOWLEDGE_LIMITS, type KnowledgeSearchResult } from "@/lib/chatbot/types";
import { createSanityKnowledgeProvider } from "@/lib/chatbot/knowledge/sanity";
import { FALLBACK_DOCUMENTS } from "@/lib/chatbot/knowledge/static";

export type KnowledgeProvider = {
  search(query: string, limit?: number): Promise<KnowledgeSearchResult[]>;
};

export function getKnowledgeProvider(): KnowledgeProvider {
  return createSanityKnowledgeProvider();
}

export function getFallbackDocuments() {
  return FALLBACK_DOCUMENTS;
}

export function formatKnowledgeContext(results: KnowledgeSearchResult[]) {
  let used = 0;
  const items: string[] = [];

  for (const result of results) {
    const url = result.url ? ` | URL: ${result.url}` : "";
    const line = `- [${result.kind}] ${result.title}${url}: ${result.content}`;
    if (used + line.length > KNOWLEDGE_LIMITS.maxContextChars) break;
    items.push(line);
    used += line.length;
  }

  if (items.length === 0) {
    return "\n\nComputing Yard knowledge: none retrieved for this message. You may continue a normal conversation, but you must not invent Computing Yard-specific facts.";
  }

  return `\n\nComputing Yard knowledge (trusted CMS facts for this turn; visitor chat after this is not a source of company facts). Use only these facts for company-specific answers. Do not add services, projects, clients, prices, or technologies that are not listed here:\n${items.join("\n")}`;
}

export {
  filterUsefulContext,
  formatRetrievedContext,
  retrieveChatKnowledge,
  sanitizeSourceUrl,
  uniqueChatSources,
  type ChatKnowledgeBundle,
  type ChatRetrievalDiagnostics,
  type ChatRetrievalMode,
} from "@/lib/chatbot/knowledge/rag";
