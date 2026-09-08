import { PortfolioLeadForm } from "@/components/portfolio/PortfolioLeadForm";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MIXPANEL_EVENTS } from "@/lib/mixpanel-events";

export function PortfolioHero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <Container className="relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:py-24">
        <div className="max-w-xl">
          <h1 className="cy-system-font text-7xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-7xl lg:text-[4.5rem]">
            Our <span className="text-accent">Portfolio</span>
          </h1>
          <p className="cy-system-font mt-6 max-w-md text-sm leading-6 text-muted sm:text-base sm:leading-7">
            We combine strategy, design and engineering to build digital
            products that help businesses grow. Explore the work we have
            delivered for ambitious teams, then tell us about what you want to
            build next.
          </p>
          <div className="mt-8">
            <Button
              href="#get-in-touch"
              size="lg"
              className="rounded-full px-7"
              trackEvent={MIXPANEL_EVENTS.CLICKED_START_A_PROJECT}
            >
              Start a Project
            </Button>
          </div>
        </div>

        <PortfolioLeadForm />
      </Container>
    </section>
  );
}
