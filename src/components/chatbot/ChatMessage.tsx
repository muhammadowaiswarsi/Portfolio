import { ChatContent } from "@/components/chatbot/ChatContent";
import { ChatSources } from "@/components/chatbot/ChatSources";
import { cn } from "@/lib/cn";
import type { ChatMessage as ChatMessageModel, ChatSource } from "@/lib/chatbot/types";

type ChatMessageProps = {
  message: ChatMessageModel;
  onSourceClick?: (source: ChatSource) => void;
};

export function ChatMessage({ message, onSourceClick }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-6",
          isUser
            ? "bg-accent text-accent-foreground"
            : "border border-border bg-background text-foreground",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <>
            <ChatContent content={message.content} />
            <ChatSources sources={message.sources} onSourceClick={onSourceClick} />
          </>
        )}
      </div>
    </div>
  );
}
