import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
};

const LOGO_WIDTH = 244;
const LOGO_HEIGHT = 74;

const logoImageClassName =
  "h-9 w-auto max-w-[min(100%,13.5rem)] shrink-0 object-contain object-left sm:h-11 sm:max-w-none lg:h-12";

const logoImageStyle = { width: "auto" } as const;

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex shrink-0 items-center",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      aria-label="Computing Yard home"
    >
      <Image
        src="/computing-yard-logo-dark.png"
        alt="Computing Yard"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className={cn("logo-dark", logoImageClassName)}
        style={logoImageStyle}
        priority
        unoptimized
      />
      <Image
        src="/computing-yard-logo-light.png"
        alt=""
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className={cn("logo-light hidden", logoImageClassName)}
        style={logoImageStyle}
        priority
        unoptimized
        aria-hidden="true"
      />
    </Link>
  );
}
