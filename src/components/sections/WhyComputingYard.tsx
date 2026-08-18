"use client";

import { motion } from "framer-motion";

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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,#2C5270_22%,transparent),transparent_55%)]"
      />

      <Container className="relative">
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <SectionHeading
            eyebrow="WHY COMPUTING YARD"
            title="Technology That Solves Real Business Problems"
            description="We combine strategy, design and engineering to build reliable digital products that help businesses grow, operate smarter and compete in a digital-first world."
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative hidden min-h-[18rem] overflow-hidden rounded-2xl border border-border bg-surface lg:block"
          >
            <WhyVisual />
          </motion.div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-8">
          {values.map((value, index) => (
            <motion.article
              key={value.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              className="group relative rounded-2xl border border-border bg-surface p-6 sm:p-7"
            >
              <span className="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
                {value.number}
              </p>
              <h3 className="mt-4 font-display text-xl tracking-tight text-white sm:text-2xl">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
                {value.description}
              </p>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function WhyVisual() {
  return (
    <div className="absolute inset-0 bg-[#1A202C]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,#2C5270_28%,transparent),transparent_62%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,#2C5270_18%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,#2C5270_18%,transparent)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70" />

      <div className="absolute left-8 top-8 h-24 w-24 rounded-2xl border border-primary/60 bg-primary/25" />
      <div className="absolute bottom-10 right-10 h-36 w-36 rounded-full border border-primary/40" />
      <div className="absolute right-16 top-16 size-3 rounded-full bg-accent" />
      <div className="absolute bottom-16 left-16 h-1.5 w-16 rounded-full bg-accent" />

      <p className="absolute bottom-8 left-8 text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
        Computing Yard
      </p>
    </div>
  );
}
