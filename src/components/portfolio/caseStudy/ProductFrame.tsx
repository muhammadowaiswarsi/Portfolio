import Image from "next/image";

import { cn } from "@/lib/cn";

type ProductFrameProps = {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  caption?: string;
  aspectClass?: string;
};

export function ProductFrame({
  src,
  alt,
  sizes = "(min-width: 1024px) 42vw, 100vw",
  className,
  caption,
  aspectClass = "aspect-[3/2]",
}: ProductFrameProps) {
  return (
    <figure className={cn("w-full", className)}>
      <div className="overflow-hidden rounded-[1.35rem] border border-white/12 bg-[#0c1118] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.38)] sm:p-2.5">
        <div
          className={cn(
            "relative overflow-hidden rounded-[0.95rem] bg-[#0a0f16]",
            aspectClass,
          )}
        >
          <Image
            src={src}
            alt={alt}
            fill
            unoptimized
            sizes={sizes}
            className="object-contain"
          />
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
