"use client";

import { Send } from "lucide-react";
import { useEffect, useId, useRef } from "react";

import { cn } from "@/lib/cn";
import { CHAT_LIMITS } from "@/lib/chatbot/types";

const INPUT_MAX_HEIGHT = 112;

type ChatInputProps = {
  value: string;
  disabled?: boolean;
  sending?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function ChatInput({
  value,
  disabled,
  sending,
  onChange,
  onSubmit,
}: ChatInputProps) {
  const inputId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0 && !disabled && !sending;

  useEffect(() => {
    const field = textareaRef.current;
    if (!field) return;

    field.style.height = "auto";
    const nextHeight = Math.min(field.scrollHeight, INPUT_MAX_HEIGHT);
    field.style.height = `${nextHeight}px`;
    field.style.overflowY = field.scrollHeight > INPUT_MAX_HEIGHT ? "auto" : "hidden";
  }, [value]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    if (canSend) onSubmit();
  }

  return (
    <form
      className="border-t border-border p-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (canSend) onSubmit();
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        Message Computing Yard
      </label>
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          id={inputId}
          name="chat-message"
          rows={1}
          value={value}
          maxLength={CHAT_LIMITS.message.max}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          enterKeyHint="send"
          autoFocus
          placeholder="Ask about services, projects, or a project"
          className={cn(
            "min-h-11 max-h-28 w-full resize-none overflow-hidden rounded-md border border-border bg-background px-3 py-2.5 text-sm leading-5 text-foreground outline-none transition-colors",
            "placeholder:text-foreground/35 focus:border-accent focus:ring-2 focus:ring-accent/30",
            "disabled:opacity-60",
          )}
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label={sending ? "Sending message" : "Send message"}
          className={cn(
            "inline-flex size-11 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground transition-colors",
            "hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          <Send className="size-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
