"use client";

import { History, Plus, X } from "lucide-react";

export type ChatConversationListItem = {
  id: string;
  title: string;
  updatedAt: string;
};

type ChatHistoryPanelProps = {
  open: boolean;
  loading: boolean;
  conversations: ChatConversationListItem[];
  activeId?: string;
  onClose: () => void;
  onSelect: (id: string) => void;
  onNewChat: () => void;
};

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function ChatHistoryPanel({
  open,
  loading,
  conversations,
  activeId,
  onClose,
  onSelect,
  onNewChat,
}: ChatHistoryPanelProps) {
  if (!open) return null;

  return (
    <div className="absolute inset-x-0 top-[3.65rem] z-10 mx-3 rounded-xl border border-border bg-surface shadow-[0_16px_40px_color-mix(in_srgb,var(--primary)_18%,transparent)]">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <History className="size-3.5" aria-hidden="true" />
          Conversations
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close conversation list"
          className="inline-flex size-7 items-center justify-center rounded-md text-muted hover:bg-background hover:text-foreground"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="max-h-56 overflow-y-auto p-2">
        <button
          type="button"
          onClick={onNewChat}
          className="mb-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-accent hover:bg-background"
        >
          <Plus className="size-3.5" aria-hidden="true" />
          New chat
        </button>

        {loading ? (
          <p className="px-2.5 py-3 text-xs text-muted">Loading…</p>
        ) : conversations.length === 0 ? (
          <p className="px-2.5 py-3 text-xs text-muted">No saved conversations yet.</p>
        ) : (
          <ul className="space-y-0.5">
            {conversations.map((item) => {
              const active = item.id === activeId;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className={`w-full rounded-lg px-2.5 py-2 text-left transition-colors ${
                      active
                        ? "bg-background text-foreground"
                        : "text-muted hover:bg-background hover:text-foreground"
                    }`}
                  >
                    <span className="block truncate text-xs font-medium">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-muted">
                      {formatUpdatedAt(item.updatedAt)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
