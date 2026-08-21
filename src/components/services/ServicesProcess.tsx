"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

const steps = [
  {
    title: "Discover",
    description:
      "We start by understanding your business, users, goals and technical constraints so the product is built around the right problem.",
    points: [
      "Business and user research",
      "Goals, scope and success metrics",
      "Technical requirements and constraints",
    ],
  },
  {
    title: "Plan & Design",
    description:
      "We define the product structure and shape an intuitive experience before development begins, reducing risk and rework later.",
    points: [
      "Information architecture",
      "UI/UX direction and prototypes",
      "Delivery plan and milestones",
    ],
  },
  {
    title: "Develop",
    description:
      "Our engineers build the product with scalable architecture, clean code and the technologies best suited to your requirements.",
    points: [
      "Frontend and backend development",
      "APIs and third-party integrations",
      "Iterative, reviewable delivery",
    ],
  },
  {
    title: "Test & Refine",
    description:
      "We test functionality, performance, responsiveness and usability so the product is ready for real users, not just a demo.",
    points: [
      "Functional and device testing",
      "Performance and quality checks",
      "Feedback-driven refinement",
    ],
  },
  {
    title: "Launch",
    description:
      "We deploy the product, support go-live and make sure everything is stable, documented and ready for day-one use.",
    points: [
      "Production deployment",
      "Launch support",
      "Handover and documentation",
    ],
  },
  {
    title: "Improve & Scale",
    description:
      "After launch we keep improving the product as your users grow, requirements change and new opportunities appear.",
    points: [
      "Iteration and new features",
      "Performance and reliability improvements",
      "Long-term product partnership",
    ],
  },
] as const;

export function ServicesProcess() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = steps[activeIndex];

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          align="center"
          title="Our Development Process"
          description="A clear, collaborative path from idea to launch — with room to improve as your product grows."
          className="mx-auto"
          headingClassName="font-display font-semibold"
        />

        <div className="mt-12 overflow-hidden rounded-[1.75rem] border border-border lg:grid lg:grid-cols-[minmax(16rem,0.42fr)_minmax(0,1fr)]">
          <div className="bg-primary p-3 sm:p-4">
            <div className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
              {steps.map((step, index) => {
                const selected = index === activeIndex;

                return (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "flex min-w-[13.5rem] items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-medium tracking-wide transition-colors lg:min-w-0",
                      selected
                        ? "bg-background text-foreground"
                        : "text-primary-foreground/85 hover:bg-black/15 hover:text-primary-foreground",
                    )}
                    aria-pressed={selected}
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full text-xs",
                        selected
                          ? "bg-accent text-accent-foreground"
                          : "bg-white/15 text-primary-foreground",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {step.title}
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div
            key={active.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-surface p-6 sm:p-8 lg:p-10"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
              Step {String(activeIndex + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
              {active.title}
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
              {active.description}
            </p>
            <ul className="mt-6 space-y-2.5">
              {active.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm leading-6 text-foreground/85 sm:text-[15px]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
