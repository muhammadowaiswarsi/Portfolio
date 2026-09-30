"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { navigation } from "@/lib/navigation";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({
  className,
  itemClassName,
}: {
  className?: string;
  itemClassName?: string;
}) {
  const pathname = usePathname() || "/";

  return (
    <nav className={className} aria-label="Primary">
      {navigation.map((item) => {
        const active = isActivePath(pathname, item.href);

        return (
          <a
            key={item.href}
            href={item.href}
            data-nav={item.href}
            data-active={active ? "" : undefined}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative px-3 py-2 text-sm text-foreground/70 transition-colors duration-200 hover:text-accent data-[active]:text-foreground",
              itemClassName,
            )}
          >
            {item.label}
            <span className="absolute inset-x-3 -bottom-px hidden h-0.5 bg-accent group-data-[active]:block" />
          </a>
        );
      })}
    </nav>
  );
}
