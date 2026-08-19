"use client";

import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We understand your business, goals, users and project requirements.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "We transform ideas into intuitive, modern and purposeful digital experiences.",
  },
  {
    number: "03",
    title: "Develop",
    description:
      "Our engineers build scalable, secure and high-performance solutions.",
  },
  {
    number: "04",
    title: "Launch & Grow",
    description:
      "We launch, monitor and continuously improve your product as your business grows.",
  },
] as const;

export function Process() {
  return (
    <section className="border-t border-border bg-background py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="HOW WE WORK"
          title="From Idea to Impact"
          description="A clear, collaborative process designed to turn your idea into a reliable digital product."
        />

        <ol className="relative mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <span
            aria-hidden="true"
            className="absolute top-6 left-6 hidden h-px w-[calc(75%+1.125rem)] bg-primary/50 lg:block"
          />
          <span
            aria-hidden="true"
            className="absolute top-6 bottom-6 left-6 w-px bg-primary/50 md:hidden"
          />

          {steps.map((step, index) => (
            <motion.li
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              className="relative"
            >
              <article className="group h-full rounded-2xl border border-border bg-surface p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary sm:p-7">
                <span className="relative z-10 mb-6 flex size-12 items-center justify-center rounded-full border border-primary bg-background text-sm font-medium tracking-wide text-accent transition-colors duration-300 group-hover:border-accent">
                  {step.number}
                </span>
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
                  {step.description}
                </p>
              </article>
            </motion.li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
