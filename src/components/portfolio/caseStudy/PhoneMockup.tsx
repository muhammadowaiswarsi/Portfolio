import Image from "next/image";

import { cn } from "@/lib/cn";

type PhoneMockupProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  caption?: string;
  fit?: "cover" | "contain";
};

export function PhoneMockup({
  src,
  alt,
  priority = false,
  sizes = "(min-width: 1024px) 280px, 55vw",
  className,
  caption,
  fit = "contain",
}: PhoneMockupProps) {
  return (
    <figure className={cn("mx-auto w-full max-w-[17.5rem]", className)}>
      <div className="relative rounded-[2.15rem] border border-white/14 bg-[#0b1017] p-2 shadow-[0_28px_70px_rgba(0,0,0,0.45)]">
        <div
          aria-hidden="true"
          className="mx-auto mb-1.5 h-1.5 w-16 rounded-full bg-black"
        />
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.55rem] bg-[#e8eef4]">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            unoptimized
            sizes={sizes}
            className={
              fit === "contain" ? "object-contain" : "object-cover object-top"
            }
          />
        </div>
        <div
          aria-hidden="true"
          className="mx-auto mt-1.5 h-1 w-10 rounded-full bg-white/20"
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
