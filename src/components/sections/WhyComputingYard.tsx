import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const values = [
  {
    number: "01",
    title: "Business-Focused",
    description:
      "We build technology around your goals, users and measurable business outcomes.",
  },
  {
    number: "02",
    title: "Built to Scale",
    description:
      "Our solutions are designed with performance, security and future growth in mind.",
  },
  {
    number: "03",
    title: "End-to-End Expertise",
    description:
      "From idea and design to development and deployment, we handle the complete digital journey.",
  },
] as const;

export function WhyComputingYard() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-background py-20 sm:py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--primary)_22%,transparent),transparent_55%)]"
      />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <SectionHeading
            eyebrow="WHY COMPUTING YARD"
            title="Technology That Solves Real Business Problems"
            description="We combine strategy, design and engineering to build reliable digital products that help businesses grow, operate smarter and compete in a digital-first world."
          />

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_70px_color-mix(in_srgb,var(--primary)_16%,transparent)]">
            <Image
              src="/why-computing-yard.png"
              alt="Strategy, design and engineering working together on a digital product"
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-8">
          {values.map((value) => (
            <article
              key={value.number}
              className="group relative rounded-2xl border border-border bg-surface p-6 sm:p-7"
            >
              <span className="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
                {value.number}
              </p>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
