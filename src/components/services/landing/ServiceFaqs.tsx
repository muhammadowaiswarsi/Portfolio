"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { completeFaqs } from "@/components/services/landing/helpers";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import type { ServiceLanding } from "@/types/sanity";

type ServiceFaqsProps = {
  service: ServiceLanding;
};

export function ServiceFaqs({ service }: ServiceFaqsProps) {
  const faqs = completeFaqs(service.faqs);
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="FAQs"
          title="Frequently Asked Questions"
          headingClassName="font-display font-semibold"
        />

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-border rounded-2xl border border-border bg-surface px-5 sm:px-7">
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const headerId = `${baseId}-header-${index}`;

            return (
              <div key={faq._key || `${faq.question}-${index}`}>
                <h3>
                  <button
                    type="button"
                    id={headerId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="font-display text-base font-semibold tracking-[-0.02em] text-foreground sm:text-lg">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-5 shrink-0 text-accent transition-transform duration-200",
                        open && "rotate-180",
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
                      <p className="pb-5 text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
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
