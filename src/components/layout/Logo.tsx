import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      aria-label="Computing Yard home"
    >
      <Image
        src="/computing-yard-logo-dark.png"
        alt="Computing Yard"
        width={132}
        height={136}
        className="logo-dark h-16 w-auto sm:h-[4.5rem]"
        priority
        unoptimized
      />
      <Image
        src="/computing-yard-logo-light.png"
        alt=""
        width={132}
        height={136}
        className="logo-light hidden h-16 w-auto sm:h-[4.5rem]"
        priority
        unoptimized
        aria-hidden="true"
      />
    </Link>
  );
}
