import Link from "next/link";

import type { ChatSource, KnowledgeKind } from "@/lib/chatbot/types";

const SOURCE_LABELS: Record<KnowledgeKind, string> = {
  company: "Company",
  service: "Service",
  project: "Project",
  blog: "Article",
  faq: "FAQ",
  technology: "Technology",
  testimonial: "Testimonial",
};

type ChatSourcesProps = {
  sources?: ChatSource[];
  onSourceClick?: (source: ChatSource) => void;
};

export function ChatSources({ sources, onSourceClick }: ChatSourcesProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2.5 border-t border-border/70 pt-2">
      <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
        Sources
      </p>
      <ul className="mt-1.5 space-y-1">
        {sources.map((source) => {
          const label = `${SOURCE_LABELS[source.type] ?? source.type}: ${source.title}`;

          return (
            <li key={source.id} className="min-w-0">
              {source.url ? (
                <Link
                  href={source.url}
                  className="block truncate text-[11px] text-muted transition-colors hover:text-accent"
                  onClick={() => onSourceClick?.(source)}
                >
                  {label}
                </Link>
              ) : (
                <span className="block truncate text-[11px] text-muted">
                  {label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
