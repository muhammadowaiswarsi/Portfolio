import Link from "next/link";

import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      prefetch={false}
      className={cn(
        "inline-flex shrink-0 items-center",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      aria-label="Computing Yard home"
    >
      <img
        src="/computing-yard-logo-dark.webp"
        alt="Computing Yard"
        width={144}
        height={33}
        decoding="async"
        fetchPriority="low"
        className="logo-dark h-7 w-auto max-w-[11.5rem] shrink-0 object-contain object-left sm:h-8 lg:h-9"
      />
      <img
        src="/computing-yard-logo-light.webp"
        alt=""
        width={144}
        height={33}
        decoding="async"
        loading="lazy"
        className="logo-light hidden h-7 w-auto max-w-[11.5rem] shrink-0 object-contain object-left sm:h-8 lg:h-9"
        aria-hidden="true"
      />
    </Link>
  );
}
