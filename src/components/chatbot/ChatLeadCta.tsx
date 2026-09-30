type ChatLeadCtaProps = {
  disabled?: boolean;
  onStart: () => void;
};

export function ChatLeadCta({ disabled, onStart }: ChatLeadCtaProps) {
  return (
    <div className="rounded-xl border border-border bg-background px-3 py-3">
      <p className="text-xs leading-5 text-muted">Want to discuss your project?</p>
      <button
        type="button"
        disabled={disabled}
        onClick={onStart}
        className="mt-2 inline-flex h-8 items-center rounded-md bg-accent px-3 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60"
      >
        Start a Project
      </button>
    </div>
  );
}
