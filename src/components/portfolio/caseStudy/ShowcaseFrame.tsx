import Image from "next/image";

import { cn } from "@/lib/cn";

type ShowcaseFrameProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  caption?: string;
  layout?: "wide" | "tall";
};

export function ShowcaseFrame({
  src,
  alt,
  priority = false,
  sizes = "(min-width: 1024px) 720px, 100vw",
  className,
  caption,
  layout = "wide",
}: ShowcaseFrameProps) {
  return (
    <figure
      className={cn(
        layout === "tall" ? "mx-auto w-full max-w-[28rem]" : "w-full",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[1.35rem] border border-border bg-surface shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
        <Image
          src={src}
          alt={alt}
          width={layout === "tall" ? 800 : 1600}
          height={layout === "tall" ? 1400 : 1200}
          priority={priority}
          unoptimized
          sizes={sizes}
          className="h-auto w-full"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      {caption ? (
        <figcaption className="mt-4 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
