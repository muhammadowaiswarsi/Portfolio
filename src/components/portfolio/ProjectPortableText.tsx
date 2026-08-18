import { PortableText, type PortableTextComponents } from "next-sanity";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 text-base leading-7 text-muted last:mb-0 sm:text-lg sm:leading-8">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 font-sans text-2xl font-semibold tracking-[-0.02em] text-white first:mt-0 sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 font-sans text-xl font-semibold tracking-[-0.02em] text-white first:mt-0 sm:text-2xl">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-accent pl-5 text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 list-disc space-y-2 pl-5 text-base leading-7 text-muted sm:text-lg sm:leading-8">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 list-decimal space-y-2 pl-5 text-base leading-7 text-muted sm:text-lg sm:leading-8">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-white">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
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

type ProjectPortableTextProps = {
  value: unknown[];
};

export function ProjectPortableText({ value }: ProjectPortableTextProps) {
  if (!value.length) return null;

  return <PortableText value={value} components={components} />;
}
