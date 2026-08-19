import Image from "next/image";
import { PortableText, type PortableTextComponents } from "next-sanity";

import { urlFor } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;

      const alt =
        typeof value.alt === "string" && value.alt.trim()
          ? value.alt
          : "Article image";

      return (
        <figure className="my-10 overflow-hidden rounded-2xl border border-border">
          <div className="relative aspect-[16/9] bg-primary/30">
            <Image
              src={urlFor(value).width(1400).fit("max").url()}
              alt={alt}
              fill
              sizes="(min-width: 768px) 720px, 100vw"
              className="object-cover"
            />
          </div>
          {typeof value.alt === "string" && value.alt.trim() ? (
            <figcaption className="border-t border-border bg-surface px-4 py-3 text-sm text-muted">
              {value.alt}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="mb-6 text-base leading-8 text-muted last:mb-0 sm:text-lg sm:leading-9">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 font-display text-2xl font-semibold tracking-[-0.02em] text-foreground first:mt-0 sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-3 font-display text-xl font-semibold tracking-[-0.02em] text-foreground first:mt-0 sm:text-2xl">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-8 mb-3 font-display text-lg font-semibold tracking-[-0.02em] text-foreground">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-accent pl-5 text-base leading-8 text-foreground/90 sm:text-lg sm:leading-9">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 list-disc space-y-2 pl-5 text-base leading-8 text-muted sm:text-lg sm:leading-9">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 list-decimal space-y-2 pl-5 text-base leading-8 text-muted sm:text-lg sm:leading-9">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-primary/30 px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const isExternal = href.startsWith("http");

      return (
        <a
          href={href}
          className="text-accent transition-colors hover:text-accent-hover"
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
};

type BlogPortableTextProps = {
  value: unknown[];
};

export function BlogPortableText({ value }: BlogPortableTextProps) {
  if (!value.length) return null;

  return <PortableText value={value} components={components} />;
}
