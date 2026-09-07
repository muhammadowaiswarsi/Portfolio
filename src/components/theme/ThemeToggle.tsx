"use client";

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
      <svg
        viewBox="0 0 24 24"
        className="theme-toggle-sun size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="theme-toggle-moon hidden size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5Z" />
      </svg>
    </button>
  );
}
