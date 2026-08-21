"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" as const },
  }),
};

export function ServicesCta() {
  return (
    <section className="pb-16 sm:pb-20 lg:pb-24">
      <Container>
        <motion.div
          className="flex flex-col gap-6 rounded-[1.75rem] border border-border bg-surface px-6 py-8 sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          custom={0.08}
          variants={fadeUp}
        >
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl lg:text-[2.15rem]">
              Let&apos;s Build Something Great, Together
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted sm:text-base sm:leading-7">
              Tell us about your idea and we will help you turn it into a
              reliable digital product.
            </p>
          </div>
          <Button href="/contact" size="lg" className="w-fit shrink-0 rounded-full px-7">
            Let&apos;s Talk
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
