import Image from "next/image";

import { cn } from "@/lib/cn";

type LaptopMockupProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  fit?: "cover" | "contain";
  aspectClass?: string;
};

export function LaptopMockup({
  src,
  alt,
  priority = false,
  sizes = "(min-width: 1024px) 42vw, 100vw",
  className,
  fit = "cover",
  aspectClass = "aspect-[16/10]",
}: LaptopMockupProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden rounded-t-[1.15rem] border border-white/12 bg-[#0c1118] p-[0.55rem] shadow-[0_28px_70px_rgba(0,0,0,0.42)] sm:p-2">
        <div
          className={cn(
            "relative overflow-hidden rounded-[0.55rem] bg-[#0a0f16]",
            aspectClass,
          )}
        >
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
      </div>
      <div className="relative">
        <div className="h-3 rounded-b-[1rem] border border-t-0 border-white/10 bg-gradient-to-b from-[#2c3648] to-[#1a202c]" />
        <div className="mx-auto -mt-px h-1.5 w-[70%] rounded-b-full bg-[#141a22]" />
      </div>
    </div>
  );
}
