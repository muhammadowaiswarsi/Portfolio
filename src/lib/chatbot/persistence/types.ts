import type { ChatSource } from "@/lib/chatbot/types";
import type { LeadSession } from "@/lib/chatbot/lead";

export type StoredChatRole = "user" | "assistant";

export type StoredChatMessage = {
  _id: string;
  conversationId: string;
  role: StoredChatRole;
  content: string;
  sources?: ChatSource[];
  createdAt: Date;
};

export type StoredConversation = {
  _id: string;
  sessionId: string;
  /** Optional future auth user id */
  userId?: string | null;
  title: string;
  lead?: LeadSession;
  createdAt: Date;
  updatedAt: Date;
};

export type StoredChatSession = {
  _id: string;
  tokenHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ConversationSummary = {
  id: string;
  title: string;
  updatedAt: string;
};

export type ConversationDetail = {
  id: string;
  title: string;
  updatedAt: string;
  messages: Array<{
    id: string;
    role: StoredChatRole;
    content: string;
    createdAt: string;
    sources?: ChatSource[];
  }>;
};
