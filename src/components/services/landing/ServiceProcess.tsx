"use client";

import { motion } from "framer-motion";

import { completeProcessSteps } from "@/components/services/landing/helpers";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ServiceLanding } from "@/types/sanity";

type ServiceProcessProps = {
  service: ServiceLanding;
};

export function ServiceProcess({ service }: ServiceProcessProps) {
  const steps = completeProcessSteps(service.process);

  if (steps.length === 0) return null;

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="HOW WE WORK"
          title="Our Process"
          headingClassName="font-display font-semibold"
        />

        <ol className="relative mt-12 max-w-4xl">
          {steps.map((step, index) => {
            const number = String(step.displayNumber).padStart(2, "0");
            const isLast = index === steps.length - 1;

            return (
              <motion.li
                key={step._key || `${step.title}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index, 6) * 0.06,
                  ease: "easeOut",
                }}
                className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-5 pb-10 last:pb-0 sm:gap-8"
              >
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-14 bottom-0 left-[1.375rem] w-px bg-border sm:left-[1.625rem]"
                  />
                ) : null}
                <span className="relative z-10 mt-1 flex size-11 shrink-0 items-center justify-center rounded-full border border-primary bg-background text-sm font-medium tracking-wide text-accent sm:size-14 sm:text-base">
                  {number}
                </span>
                <article className="rounded-2xl border border-border bg-surface p-6 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-primary sm:p-7">
                  <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
                    {step.description}
                  </p>
                </article>
              </motion.li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
