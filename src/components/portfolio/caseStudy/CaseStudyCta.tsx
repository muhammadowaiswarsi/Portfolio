"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { caseStudySectionClass, fadeUp } from "@/components/portfolio/caseStudy/helpers";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function CaseStudyCta() {
  return (
    <section className="relative overflow-hidden border-t border-border py-20 sm:py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,#2C5270_28%,transparent),transparent_62%)]"
      />
      <Container className="relative">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          custom={0.08}
          variants={fadeUp}
        >
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
            Start Your Project
          </p>
          <h2 className={`text-3xl leading-[1.15] sm:text-4xl lg:text-5xl ${caseStudySectionClass}`}>
            Ready to build something like this?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Tell us about your idea and we will help you turn it into a
            reliable digital product.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/contact" size="lg">
              Start a Project
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Button>
            <Button href="/portfolio" variant="secondary" size="lg">
              View Portfolio
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
