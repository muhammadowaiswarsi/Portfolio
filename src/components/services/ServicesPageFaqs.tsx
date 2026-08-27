"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

const faqs = [
  {
    question: "How long does a typical project take?",
    answer:
      "Timelines depend on scope, complexity and integrations. After we understand your requirements, we share a realistic roadmap and delivery plan.",
  },
  {
    question: "Can you build a product from scratch?",
    answer:
      "Yes. We can take an idea from discovery and UI/UX design through development, testing and launch.",
  },
  {
    question: "Can you improve an existing application?",
    answer:
      "Yes. We can redesign, refactor, optimize or add new functionality to an existing web or mobile product.",
  },
  {
    question: "What technologies do you work with?",
    answer:
      "We work with modern web, product and AI stacks including Next.js, React, Node.js, NestJS, PostgreSQL, MongoDB, AWS, Firebase, OpenAI and more — chosen to fit the product.",
  },
  {
    question: "Do you build AI products and chatbots?",
    answer:
      "Yes. We design and build AI-powered chatbots and intelligent product features that automate conversations, support customers and fit into your existing workflows.",
  },
  {
    question: "How do we get started?",
    answer:
      "Share your idea through the form or contact page. We will review the requirements, discuss the best approach and outline the next steps.",
  },
  {
    question: "Do you work with startups and established businesses?",
    answer:
      "Yes. We partner with early-stage teams and growing companies that need a reliable technology partner to design, build and scale digital products.",
  },
] as const;

export function ServicesPageFaqs() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          align="center"
          title="Frequently Asked Questions"
          description="A few of the questions teams usually ask before starting a project with Computing Yard."
          className="mx-auto"
          headingClassName="font-display font-semibold"
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const headerId = `${baseId}-header-${index}`;

            return (
              <div
                key={faq.question}
                className="h-fit rounded-2xl border border-border bg-surface px-5 sm:px-6"
              >
                <h3>
                  <button
                    type="button"
                    id={headerId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="font-display text-sm font-semibold tracking-[-0.02em] text-foreground sm:text-base">
                      {faq.question}
                    </span>
                    <Plus
                      className={cn(
                        "size-5 shrink-0 text-accent transition-transform duration-200",
                        open && "rotate-45",
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm leading-6 text-muted">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
