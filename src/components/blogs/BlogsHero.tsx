"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { fadeUp } from "@/components/blogs/helpers";
import { Container } from "@/components/ui/Container";

export function BlogsHero() {
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

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
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
            <span>Blogs</span>
          </motion.p>

          <motion.p
            className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-accent"
            initial="hidden"
            animate="visible"
            custom={0.08}
            variants={fadeUp}
          >
            INSIGHTS &amp; IDEAS
          </motion.p>

          <motion.h1
            className="font-display text-4xl font-semibold leading-[1.12] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-[3.5rem]"
            initial="hidden"
            animate="visible"
            custom={0.12}
            variants={fadeUp}
          >
            Insights That Help Businesses Build{" "}
            <span className="text-accent">Better Digital Products</span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8"
            initial="hidden"
            animate="visible"
            custom={0.18}
            variants={fadeUp}
          >
            Explore practical insights, ideas and strategies across technology,
            design, AI and digital growth.
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
