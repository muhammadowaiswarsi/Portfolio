import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100dvh-5.5rem)] flex-col overflow-hidden bg-[#1a202c] lg:min-h-[calc(100dvh-6rem)]">
      <Image
        src="/hero-background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden="true"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[#1a202c]/45" />

      <Container className="relative flex flex-1 items-center py-16 sm:py-20">
        <div className="max-w-2xl lg:max-w-[38rem] [text-shadow:0_10px_32px_rgba(0,0,0,0.45)]">
          <p className="cy-reveal cy-reveal-1 mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
            Computing Yard
          </p>

          <h1 className="cy-reveal cy-reveal-2 font-display text-4xl font-semibold leading-[1.12] tracking-[-0.035em] text-white uppercase sm:text-5xl lg:text-[3.35rem] xl:text-[3.75rem]">
            We build digital products that move businesses forward.
          </h1>

          <p className="cy-reveal cy-reveal-3 mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
            We design and develop high-performance websites, web applications,
            mobile apps and digital solutions for ambitious businesses.
          </p>

          <div className="cy-reveal cy-reveal-4 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/contact" size="lg">
              Start a Project
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Button>
            <Button
              href="/portfolio"
              variant="secondary"
              size="lg"
              className="border-white/40 text-white hover:border-white hover:bg-white hover:text-[#1a202c]"
            >
              View Our Work
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
