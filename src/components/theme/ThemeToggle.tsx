"use client";

import { Moon, Sun } from "lucide-react";

import { useColorMode } from "@/components/theme/ColorModeProvider";
import { cn } from "@/lib/cn";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { toggleMode } = useColorMode();

  return (
    <button
      type="button"
      onClick={toggleMode}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-accent hover:text-accent",
        className,
      )}
      aria-label="Toggle color theme"
    >
      <Sun className="theme-toggle-sun size-4" aria-hidden="true" />
      <Moon className="theme-toggle-moon hidden size-4" aria-hidden="true" />
    </button>
  );
}
