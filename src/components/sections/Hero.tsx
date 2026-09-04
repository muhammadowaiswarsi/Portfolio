import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      <Image
        src="/hero-background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-background/40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
      />

      <Container className="relative flex min-h-[34rem] items-center py-20 sm:min-h-[38rem] sm:py-24 lg:min-h-[42rem] lg:py-28 xl:min-h-[46rem] xl:py-32">
        <div className="max-w-2xl lg:max-w-[38rem] [text-shadow:0_8px_28px_color-mix(in_srgb,var(--background)_75%,transparent)]">
          <p className="cy-reveal cy-reveal-1 mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
            Computing Yard
          </p>

          <h1 className="cy-reveal cy-reveal-2 font-display text-4xl font-semibold leading-[1.12] tracking-[-0.035em] text-foreground uppercase sm:text-5xl lg:text-[3.35rem] xl:text-[3.75rem]">
            We build digital products that move businesses forward.
          </h1>

          <p className="cy-reveal cy-reveal-3 mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            We design and develop high-performance websites, web applications,
            mobile apps and digital solutions for ambitious businesses.
          </p>

          <div className="cy-reveal cy-reveal-4 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/contact" size="lg">
              Start a Project
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Button>
            <Button href="/portfolio" variant="secondary" size="lg">
              View Our Work
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
