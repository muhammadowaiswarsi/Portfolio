"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { navigation } from "@/lib/navigation";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 shadow-[0_1px_0_0_var(--border)] backdrop-blur-md">
      <Container>
        <div className="flex h-[5.5rem] items-center justify-between gap-4 lg:h-24">
          <Logo />

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Primary"
          >
            {navigation.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-sm transition-colors duration-200",
                    active
                      ? "text-white"
                      : "text-white/70 hover:text-accent",
                  )}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-px h-0.5 bg-accent"
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Button href="/contact" size="sm">
              Let&apos;s Talk
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md text-white transition-colors hover:bg-surface hover:text-accent lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="border-t border-border bg-background lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Container className="flex flex-col gap-1 py-4">
              {navigation.map((item, index) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-md px-3 py-3 text-base",
                        active
                          ? "bg-surface text-white"
                          : "text-white/80 hover:bg-surface hover:text-accent",
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="px-3 pt-3">
                <Button href="/contact" className="w-full">
                  Let&apos;s Talk
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
