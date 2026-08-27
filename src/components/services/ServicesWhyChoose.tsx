"use client";

import { motion } from "framer-motion";
import {
  Handshake,
  ShieldCheck,
  TrendingUp,
  Users,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const reasons: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Tailored Solutions, Built for Scale",
    description:
      "We design products around your workflows and goals, then structure them to grow with your users and business.",
    icon: TrendingUp,
  },
  {
    title: "Expert Teams with Practical Experience",
    description:
      "Designers and engineers work together to deliver reliable software, not disconnected handoffs.",
    icon: Users,
  },
  {
    title: "Clear, Collaborative Process",
    description:
      "You stay involved from discovery to launch, with transparent progress and decisions at every stage.",
    icon: Workflow,
  },
  {
    title: "Future-Ready Technologies",
    description:
      "We use modern, proven tools — including AI where it creates real value — so your product stays maintainable, performant and ready for what comes next.",
    icon: Zap,
  },
  {
    title: "Secure and Maintainable by Design",
    description:
      "Stability, security and long-term quality are built into the architecture from the start.",
    icon: ShieldCheck,
  },
  {
    title: "A Partner, Not Just a Vendor",
    description:
      "We work closely with your team, understand the business, and stay invested after launch.",
    icon: Handshake,
  },
];

export function ServicesWhyChoose() {
  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          align="center"
          title="Why Choose Computing Yard"
          description="We combine strategy, design and engineering to build digital products that create real business value."
          className="mx-auto"
          headingClassName="font-display font-semibold"
        />

        <div className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <motion.article
                key={reason.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index, 5) * 0.06,
                  ease: "easeOut",
                }}
                className="relative rounded-2xl border border-border bg-surface px-6 pb-8 pt-12 text-center transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary"
              >
                <span className="absolute left-1/2 top-0 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[0_10px_24px_color-mix(in_srgb,var(--accent)_35%,transparent)]">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-lg font-semibold tracking-[-0.02em] text-foreground sm:text-xl">
                  {reason.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
                  {reason.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
