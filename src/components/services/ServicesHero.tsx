"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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

export function ServicesHero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_srgb,var(--primary)_28%,transparent),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_48%)]"
      />

      <Container className="relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:py-24">
        <div className="max-w-xl">
          <motion.p
            className="mb-5 text-sm font-medium text-accent"
            initial="hidden"
            animate="visible"
            custom={0.04}
            variants={fadeUp}
          >
            <Link href="/" className="transition-colors hover:text-accent-hover">
              Home
            </Link>
            <span className="mx-2 text-muted">»</span>
            <span>Services</span>
          </motion.p>

          <motion.h1
            className="font-display text-4xl font-semibold leading-[1.12] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-[3.5rem]"
            initial="hidden"
            animate="visible"
            custom={0.1}
            variants={fadeUp}
          >
            Digital Solutions Built Around{" "}
            <span className="text-accent">Your Business</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-base leading-7 text-muted sm:text-lg sm:leading-8"
            initial="hidden"
            animate="visible"
            custom={0.16}
            variants={fadeUp}
          >
            We design, build and optimize digital experiences that help
            businesses grow, engage customers and move forward.
          </motion.p>

          <motion.div
            className="mt-8"
            initial="hidden"
            animate="visible"
            custom={0.24}
            variants={fadeUp}
          >
            <Button href="#get-in-touch" size="lg" className="rounded-full px-7">
              Let&apos;s Talk
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
