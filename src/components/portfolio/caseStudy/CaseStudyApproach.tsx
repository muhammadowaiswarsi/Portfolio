"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import {
  caseStudySubheadClass,
  completeCaseStudyItems,
  getImageUrl,
} from "@/components/portfolio/caseStudy/helpers";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { CaseStudyItem } from "@/types/sanity";

type CaseStudyApproachProps = {
  items?: CaseStudyItem[] | null;
};

export function CaseStudyApproach({ items }: CaseStudyApproachProps) {
  const steps = completeCaseStudyItems(items);

  if (steps.length === 0) return null;

  const columnClass =
    steps.length === 1
      ? "md:grid-cols-1"
      : steps.length === 2
        ? "md:grid-cols-2"
        : steps.length === 3
          ? "md:grid-cols-2 lg:grid-cols-3"
          : "md:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Process"
          title="Our Approach"
          headingClassName="font-display font-semibold"
        />

        <ol className={`mt-12 grid gap-6 lg:gap-8 ${columnClass}`}>
          {steps.map((step, index) => {
            const imageUrl = getImageUrl(step.image, 1200, 750);
            const imageAlt = step.image?.alt || step.title || "Approach step";
            const number = String(index + 1).padStart(2, "0");

            return (
              <motion.li
                key={step._key || `${step.title}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.06,
                  ease: "easeOut",
                }}
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface">
                  {imageUrl ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-primary/25">
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <span className="mb-5 flex size-12 items-center justify-center rounded-full border border-primary bg-background text-sm font-medium tracking-wide text-accent">
                      {number}
                    </span>
                    <h3 className={`text-xl sm:text-2xl ${caseStudySubheadClass}`}>
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
                      {step.description}
                    </p>
                  </div>
                </article>
              </motion.li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
