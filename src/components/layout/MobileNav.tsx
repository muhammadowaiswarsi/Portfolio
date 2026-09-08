import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MIXPANEL_EVENTS } from "@/lib/mixpanel-events";
import { navigation } from "@/lib/navigation";

export function MobileNav() {
  return (
    <details className="group lg:hidden">
      <summary
        className="inline-flex size-10 list-none items-center justify-center rounded-md text-foreground transition-colors hover:bg-surface hover:text-accent [&::-webkit-details-marker]:hidden"
        aria-label="Open menu"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5 group-open:hidden"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          className="hidden size-5 group-open:block"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M6 6 18 18M18 6 6 18" />
        </svg>
      </summary>
      <div className="fixed inset-x-0 top-[5.5rem] z-50 border-t border-border bg-background lg:top-24">
        <Container className="flex flex-col gap-1 py-4">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-nav={item.href}
              className="block rounded-md px-3 py-3 text-base text-foreground/80 hover:bg-surface hover:text-accent data-[active]:bg-surface data-[active]:text-foreground"
            >
              {item.label}
            </a>
          ))}
          <div className="px-3 pt-3">
            <Button
              href="/contact"
              prefetch={false}
              className="w-full"
              trackEvent={MIXPANEL_EVENTS.CLICKED_LETS_TALK}
            >
              Let&apos;s Talk
            </Button>
          </div>
        </Container>
      </div>
    </details>
  );
}
