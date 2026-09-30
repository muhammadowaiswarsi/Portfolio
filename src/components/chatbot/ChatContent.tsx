import Link from "next/link";
import type { ReactNode } from "react";

const INTERNAL_PATH = /^\/(?:contact|services|portfolio|blogs)(?:\/[\w-]+)*\/?$/i;
const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/g;
const BARE_LINK = /(https?:\/\/[^\s<]+|\/(?:contact|services|portfolio|blogs)(?:\/[\w-]+)*)/gi;

function isSafeHref(href: string) {
  const value = href.trim();
  if (INTERNAL_PATH.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function renderInline(text: string) {
  const nodes: Array<string | { href: string; label: string }> = [];
  let cursor = 0;
  const markdown = [...text.matchAll(MARKDOWN_LINK)];

  for (const match of markdown) {
    const index = match.index ?? 0;
    if (index > cursor) {
      nodes.push(text.slice(cursor, index));
    }

    const label = match[1] ?? "";
    const href = match[2] ?? "";
    if (label && isSafeHref(href)) {
      nodes.push({ href, label });
    } else {
      nodes.push(match[0] ?? "");
    }

    cursor = index + match[0].length;
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  const expanded: Array<string | { href: string; label: string }> = [];

  for (const node of nodes) {
    if (typeof node !== "string") {
      expanded.push(node);
      continue;
    }

    let local = 0;
    const matches = [...node.matchAll(BARE_LINK)];
    if (matches.length === 0) {
      expanded.push(node);
      continue;
    }

    for (const match of matches) {
      const index = match.index ?? 0;
      if (index > local) expanded.push(node.slice(local, index));
      const href = (match[0] ?? "").replace(/[),.;!?]+$/, "");
      if (isSafeHref(href)) {
        expanded.push({ href, label: href });
      } else {
        expanded.push(match[0] ?? "");
      }
      local = index + (match[0]?.length ?? 0);
    }

    if (local < node.length) expanded.push(node.slice(local));
  }

  return expanded.flatMap((part, index) => {
    if (typeof part !== "string") {
      if (part.href.startsWith("/")) {
        return (
          <Link
            key={`l-${index}`}
            href={part.href}
            className="underline decoration-accent/70 underline-offset-2 hover:text-accent"
          >
            {part.label}
          </Link>
        );
      }

      return (
        <a
          key={`a-${index}`}
          href={part.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-accent/70 underline-offset-2 hover:text-accent"
        >
          {part.label}
        </a>
      );
    }

    const pieces: ReactNode[] = [];
    const bold = part.split(/(\*\*[^*]+\*\*)/g);

    bold.forEach((chunk, chunkIndex) => {
      if (chunk.startsWith("**") && chunk.endsWith("**") && chunk.length > 4) {
        pieces.push(
          <strong key={`b-${index}-${chunkIndex}`} className="font-medium">
            {chunk.slice(2, -2)}
          </strong>,
        );
        return;
      }
      if (chunk) {
        pieces.push(<span key={`t-${index}-${chunkIndex}`}>{chunk}</span>);
      }
    });

    return pieces;
  });
}

function isBulletLine(line: string) {
  return /^\s*(?:[-*]|\d+\.)\s+/.test(line);
}

function bulletText(line: string) {
  return line.replace(/^\s*(?:[-*]|\d+\.)\s+/, "");
}

function isHeadingLine(line: string) {
  return /^\s{0,3}#{1,6}\s+\S/.test(line);
}

function headingText(line: string) {
  return line.replace(/^\s{0,3}#{1,6}\s+/, "").trim();
}

export function ChatContent({ content }: { content: string }) {
  const blocks = content
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-2.5">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").map((line) => line.trimEnd());
        const nonEmpty = lines.filter((line) => line.trim());

        // Single markdown heading block: ### Overview
        if (nonEmpty.length === 1 && isHeadingLine(nonEmpty[0]!)) {
          return (
            <p
              key={blockIndex}
              className="text-sm font-semibold text-foreground"
            >
              {renderInline(headingText(nonEmpty[0]!))}
            </p>
          );
        }

        // Mixed block: heading line(s) + bullets/paragraphs
        if (nonEmpty.some(isHeadingLine)) {
          const sections: ReactNode[] = [];
          let bulletBuffer: string[] = [];

          const flushBullets = (key: string) => {
            if (bulletBuffer.length === 0) return;
            sections.push(
              <ul key={key} className="list-disc space-y-1 pl-4">
                {bulletBuffer.map((line, lineIndex) => (
                  <li key={lineIndex}>{renderInline(bulletText(line))}</li>
                ))}
              </ul>,
            );
            bulletBuffer = [];
          };

          nonEmpty.forEach((line, lineIndex) => {
            if (isHeadingLine(line)) {
              flushBullets(`b-${blockIndex}-${lineIndex}`);
              sections.push(
                <p
                  key={`h-${blockIndex}-${lineIndex}`}
                  className="text-sm font-semibold text-foreground"
                >
                  {renderInline(headingText(line))}
                </p>,
              );
              return;
            }

            if (isBulletLine(line)) {
              bulletBuffer.push(line);
              return;
            }

            flushBullets(`b-${blockIndex}-${lineIndex}`);
            sections.push(
              <p
                key={`p-${blockIndex}-${lineIndex}`}
                className="whitespace-pre-wrap break-words"
              >
                {renderInline(line)}
              </p>,
            );
          });

          flushBullets(`b-${blockIndex}-end`);
          return (
            <div key={blockIndex} className="space-y-2">
              {sections}
            </div>
          );
        }

        const bullets = lines.filter((line) => line.trim() && isBulletLine(line));

        if (bullets.length >= 1 && bullets.length === lines.filter((line) => line.trim()).length) {
          return (
            <ul key={blockIndex} className="list-disc space-y-1 pl-4">
              {bullets.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInline(bulletText(line))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={blockIndex} className="whitespace-pre-wrap break-words">
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
}
