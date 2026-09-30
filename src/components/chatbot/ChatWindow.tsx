"use client";

import { History, Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import {
  ChatHistoryPanel,
  type ChatConversationListItem,
} from "@/components/chatbot/ChatHistoryPanel";
import { ChatInput } from "@/components/chatbot/ChatInput";
import { ChatLeadCta } from "@/components/chatbot/ChatLeadCta";
import { ChatMessage } from "@/components/chatbot/ChatMessage";
import { CHAT_SUGGESTIONS } from "@/lib/chatbot/ui";
import type { ChatMessage as ChatMessageModel, ChatSource } from "@/lib/chatbot/types";

type ChatWindowProps = {
  messages: ChatMessageModel[];
  input: string;
  sending: boolean;
  loading?: boolean;
  error: string | null;
  showLeadCta: boolean;
  historyOpen: boolean;
  historyLoading: boolean;
  conversations: ChatConversationListItem[];
  activeConversationId?: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onSuggest: (value: string) => void;
  onStartProject: () => void;
  onSourceClick: (source: ChatSource) => void;
  onClose: () => void;
  onToggleHistory: () => void;
  onCloseHistory: () => void;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
};

export function ChatWindow({
  messages,
  input,
  sending,
  loading = false,
  error,
  showLeadCta,
  historyOpen,
  historyLoading,
  conversations,
  activeConversationId,
  onInputChange,
  onSubmit,
  onSuggest,
  onStartProject,
  onSourceClick,
  onClose,
  onToggleHistory,
  onCloseHistory,
  onSelectConversation,
  onNewChat,
}: ChatWindowProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const busy = sending || loading;
  const empty = messages.length === 0 && !busy;

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
  }, [messages, sending, loading, error]);

  return (
    <section
      id="computing-yard-chat"
      role="dialog"
      aria-modal="false"
      aria-labelledby="computing-yard-chat-title"
      className="relative flex h-[min(36rem,calc(100dvh-6.5rem))] w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_80px_color-mix(in_srgb,var(--primary)_24%,transparent)] sm:w-[24rem]"
    >
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Image
          src="/computing-yard-icon.png"
          alt=""
          width={36}
          height={36}
          className="size-9 rounded-md object-cover"
        />
        <div className="min-w-0 flex-1">
          <p
            id="computing-yard-chat-title"
            className="text-sm font-medium text-foreground"
          >
            Computing Yard
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            AI assistant
          </p>
        </div>
        <button
          type="button"
          onClick={onNewChat}
          aria-label="Start new chat"
          title="New chat"
          className="inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onToggleHistory}
          aria-label="Open conversation history"
          aria-expanded={historyOpen}
          title="History"
          className="inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <History className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </header>

      <ChatHistoryPanel
        open={historyOpen}
        loading={historyLoading}
        conversations={conversations}
        activeId={activeConversationId}
        onClose={onCloseHistory}
        onSelect={onSelectConversation}
        onNewChat={onNewChat}
      />

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {loading && messages.length === 0 ? (
          <div
            className="flex h-full min-h-40 items-center justify-center"
            role="status"
            aria-live="polite"
          >
            <p className="flex items-center gap-2 text-sm text-muted">
              <span
                className="size-3.5 animate-spin rounded-full border-2 border-muted border-t-accent"
                aria-hidden="true"
              />
              Loading…
            </p>
          </div>
        ) : empty ? (
          <div className="space-y-4">
            <p className="text-sm leading-6 text-muted">
              Hi! I&apos;m the Computing Yard assistant. I can help you learn
              about our services, projects, technologies, and development
              capabilities.
            </p>
            <div className="flex flex-wrap gap-2">
              {CHAT_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={busy}
                  onClick={() => onSuggest(suggestion)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs leading-5 text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onSourceClick={onSourceClick}
            />
          ))
        )}
        {showLeadCta && !empty && !loading ? (
          <ChatLeadCta disabled={busy} onStart={onStartProject} />
        ) : null}
        {loading && messages.length > 0 ? (
          <p className="flex items-center gap-2 text-xs text-muted" role="status">
            <span
              className="size-3 animate-spin rounded-full border-2 border-muted border-t-accent"
              aria-hidden="true"
            />
            Loading…
          </p>
        ) : null}
        {sending ? (
          <p className="text-xs text-muted" role="status">
            Computing Yard is typing…
          </p>
        ) : null}
        {error ? (
          <p className="text-xs text-accent" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <ChatInput
        value={input}
        disabled={busy}
        sending={sending}
        onChange={onInputChange}
        onSubmit={onSubmit}
      />
    </section>
  );
}
