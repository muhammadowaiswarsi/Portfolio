"use client";

import { motion } from "framer-motion";

import { PortfolioLeadForm } from "@/components/portfolio/PortfolioLeadForm";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  }),
};

export function PortfolioHero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--primary)_28%,transparent),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--primary)_10%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--primary)_10%,transparent)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_22%,transparent_78%)]"
      />

      <Container className="relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:py-24">
        <div className="max-w-xl">
          <motion.h1
            className="font-display text-5xl font-semibold leading-[1.12] tracking-[-0.035em] text-foreground sm:text-6xl lg:text-[4.25rem]"
            initial="hidden"
            animate="visible"
            custom={0.08}
            variants={fadeUp}
          >
            Our <span className="text-accent">Portfolio</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-base leading-7 text-muted sm:text-lg sm:leading-8"
            initial="hidden"
            animate="visible"
            custom={0.16}
            variants={fadeUp}
          >
            We combine strategy, design and engineering to build digital
            products that help businesses grow. Explore the work we have
            delivered for ambitious teams, then tell us about what you want to
            build next.
          </motion.p>
          <motion.div
            className="mt-8"
            initial="hidden"
            animate="visible"
            custom={0.24}
            variants={fadeUp}
          >
            <Button href="#get-in-touch" size="lg" className="rounded-full px-7">
              Start a Project
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.18}
          variants={fadeUp}
        >
          <PortfolioLeadForm />
        </motion.div>
      </Container>
    </section>
  );
}
