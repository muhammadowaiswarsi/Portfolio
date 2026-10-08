export const CHAT_LIMITS = {
  message: { min: 1, max: 2000 },
  history: { maxMessages: 20 },
  conversationId: { max: 64 },
} as const;

export const KNOWLEDGE_LIMITS = {
  maxResults: 6,
  maxContentChars: 700,
  maxContextChars: 4200,
  catalogTtlMs: 60_000,
} as const;

export type KnowledgeKind =
  | "company"
  | "service"
  | "project"
  | "blog"
  | "faq"
  | "technology"
  | "testimonial";

export type ChatRole = "user" | "assistant" | "system";

export type ChatChannel = "website" | "whatsapp";

export type ChatSource = {
  id: string;
  title: string;
  kind: KnowledgeKind;
  type: KnowledgeKind;
  url?: string;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  sources?: ChatSource[];
};

export type ChatHistoryItem = {
  role: Exclude<ChatRole, "system">;
  content: string;
};

export type ChatRequest = {
  message: string;
  conversationId?: string;
  history?: ChatHistoryItem[];
  channel?: ChatChannel;
};

export type ChatResponse = {
  message: ChatMessage;
  conversationId: string;
  metadata?: {
    model?: string;
    channel?: ChatChannel;
    sources?: ChatSource[];
    lead?: ChatLeadMetadata;
    /** True when this turn was saved to Mongo under the visitor session. */
    persisted?: boolean;
    retrieval?: {
      mode: "hybrid" | "sanity_fallback";
      rerankerUsed: boolean;
      sourceCount: number;
      success: boolean;
      fallbackUsed: boolean;
    };
  };
};

export type ChatLeadPhase =
  | "idle"
  | "lead_detected"
  | "collecting"
  | "confirmation"
  | "submitting"
  | "submitted"
  | "failed";

export type ChatLeadMetadata = {
  phase: ChatLeadPhase;
  missing: Array<"name" | "email" | "projectType" | "projectDescription">;
  showCta: boolean;
  messageType: "info" | "lead";
};

export type KnowledgeMetadata = {
  slug?: string;
  technologies?: string[];
  industry?: string;
  projectType?: string;
};

export type KnowledgeDocument = {
  id: string;
  title: string;
  kind: KnowledgeKind;
  content: string;
  url?: string;
  metadata?: KnowledgeMetadata;
};

export type KnowledgeSearchResult = KnowledgeDocument & {
  score: number;
};
