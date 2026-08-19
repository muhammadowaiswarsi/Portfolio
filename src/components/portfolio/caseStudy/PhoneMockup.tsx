import Image from "next/image";

import { cn } from "@/lib/cn";

type PhoneMockupProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  caption?: string;
};

export function PhoneMockup({
  src,
  alt,
  priority = false,
  sizes = "(min-width: 1024px) 280px, 55vw",
  className,
  caption,
}: PhoneMockupProps) {
  return (
    <figure className={cn("mx-auto w-full max-w-[17.5rem]", className)}>
      <div className="relative rounded-[2.35rem] border border-white/14 bg-[#0b1017] p-[0.55rem] shadow-[0_28px_70px_rgba(0,0,0,0.45)]">
        <div
          aria-hidden="true"
          className="absolute top-3 left-1/2 z-10 h-[1.15rem] w-[5.5rem] -translate-x-1/2 rounded-full bg-black/85"
        />
        <div className="relative aspect-[9/19] overflow-hidden rounded-[1.85rem] bg-[#e8eef4]">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            unoptimized
            sizes={sizes}
            className="object-contain"
          />
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-4 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
