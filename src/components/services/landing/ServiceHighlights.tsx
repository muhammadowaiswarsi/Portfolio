"use client";

import { motion } from "framer-motion";
import {
  Handshake,
  MessageSquare,
  SlidersHorizontal,
  User,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import {
  completeBenefits,
  hasText,
} from "@/components/services/landing/helpers";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ServiceBenefit, ServiceLanding } from "@/types/sanity";

const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  "technical depth": Wrench,
  "straightforward communication": MessageSquare,
  "built to collaborate": Handshake,
  "engagement you can adjust": SlidersHorizontal,
  "individual developers": User,
  "dedicated teams": Users,
};

function iconForHighlight(title: string): LucideIcon {
  return HIGHLIGHT_ICONS[title.trim().toLowerCase()] ?? Handshake;
}

type ServiceHighlightsProps = {
  service: ServiceLanding;
  items?: ServiceBenefit[] | null;
  title?: string | null;
  eyebrow?: string;
  description?: string | null;
};

export function ServiceHighlights({
  service,
  items,
  title,
  eyebrow = "WHY US",
  description,
}: ServiceHighlightsProps) {
  const highlights = completeBenefits(
    items === undefined ? service.highlights : items,
  );

  if (highlights.length === 0) return null;

  const heading = hasText(title)
    ? title
    : items === undefined
      ? hasText(service.highlightsTitle)
        ? service.highlightsTitle
        : "Why Choose Computing Yard"
      : "Engagement Options";

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={heading}
          description={hasText(description) ? description : undefined}
          headingClassName="font-display font-semibold"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
          {highlights.map((highlight, index) => {
            const Icon = iconForHighlight(highlight.title ?? "");

            return (
              <motion.article
                key={highlight._key || `${highlight.title}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index, 6) * 0.06,
                  ease: "easeOut",
                }}
                className="rounded-2xl border border-border bg-surface p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary sm:p-8"
              >
                <div className="mb-5 flex size-14 items-center justify-center rounded-xl border border-primary/40 bg-primary/20">
                  <Icon className="size-6 text-accent" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
                  {highlight.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
                  {highlight.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
