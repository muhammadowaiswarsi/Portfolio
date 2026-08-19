"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  Handshake,
  Lightbulb,
  Monitor,
  Palette,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const beliefs: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Innovation",
    description: "Always look for smarter ways to solve problems.",
    icon: Lightbulb,
  },
  {
    title: "Quality",
    description: "Build reliable, maintainable and high-performing solutions.",
    icon: ShieldCheck,
  },
  {
    title: "Partnership",
    description: "Work closely with clients and grow together.",
    icon: Handshake,
  },
];

const capabilities: { title: string; icon: LucideIcon }[] = [
  { title: "Web Development", icon: Monitor },
  { title: "Mobile Development", icon: Smartphone },
  { title: "UI/UX Design", icon: Palette },
  { title: "AI Solutions", icon: Sparkles },
  { title: "E-commerce", icon: ShoppingBag },
  { title: "Cloud & Backend", icon: Cloud },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" as const },
  }),
};

export function AboutContent() {
  return (
    <>
      <section className="relative overflow-hidden bg-background py-20 sm:py-24 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--primary)_8%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--primary)_8%,transparent)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_18%,transparent_72%)]"
        />
        <Container className="relative">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.08}
            variants={fadeUp}
          >
            <SectionHeading
              as="h1"
              eyebrow="ABOUT COMPUTING YARD"
              title="We Build Technology With Purpose."
              description="Computing Yard is a technology partner focused on creating digital products and solutions that help businesses operate, grow and succeed in a digital-first world."
            />
          </motion.div>
        </Container>
      </section>

      <section className="border-t border-border bg-background py-20 sm:py-24 lg:py-28">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              custom={0.08}
              variants={fadeUp}
            >
              <SectionHeading title="Turning Ideas Into Digital Experiences" />
              <div className="mt-8 max-w-2xl space-y-5 text-base leading-7 text-muted sm:text-lg sm:leading-8">
                <p>
                  Computing Yard combines strategy, design and engineering to
                  transform business ideas into reliable digital products. We
                  start with the problem, shape a clear direction, and then
                  build software that is ready for real use.
                </p>
                <p>
                  Every engagement is treated as a partnership. We work closely
                  with clients to understand their goals, users and constraints,
                  then design and develop websites, applications and digital
                  systems that help the business operate with more clarity and
                  confidence.
                </p>
                <p>
                  From first concept to launch, our focus stays on purpose:
                  technology that is useful, durable and built to grow with the
                  people who rely on it.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0.16}
              variants={fadeUp}
              className="relative min-h-[18rem] overflow-hidden rounded-2xl border border-border bg-surface lg:min-h-[26rem]"
            >
              <StoryVisual />
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-background py-20 sm:py-24 lg:py-28">
        <Container>
          <SectionHeading title="What We Believe" />
          <div className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-8">
            {beliefs.map((belief, index) => {
              const Icon = belief.icon;

              return (
                <motion.article
                  key={belief.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                    ease: "easeOut",
                  }}
                  className="group relative rounded-2xl border border-border bg-surface p-6 sm:p-7"
                >
                  <span className="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
                  <span className="mb-6 flex size-11 items-center justify-center rounded-xl border border-primary/50 bg-primary/20 text-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
                    {belief.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
                    {belief.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-background py-20 sm:py-24 lg:py-28">
        <Container>
          <SectionHeading title="Capabilities" />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;

              return (
                <motion.li
                  key={capability.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.06,
                    ease: "easeOut",
                  }}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-4 transition-colors duration-300 hover:border-primary"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/50 bg-primary/20 text-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <p className="font-medium tracking-tight text-foreground">
                    {capability.title}
                  </p>
                </motion.li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section className="relative overflow-hidden border-t border-border py-20 sm:py-24 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-background"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--primary)_32%,transparent),transparent_62%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_42%)]"
        />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              className="font-display text-4xl font-semibold leading-[1.12] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-[3.15rem]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={0.08}
              variants={fadeUp}
            >
              Let&apos;s Build What&apos;s Next.
            </motion.h2>
            <motion.div
              className="mt-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={0.16}
              variants={fadeUp}
            >
              <Button href="/contact" size="lg">
                Start a Project
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Button>
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  );
}

function StoryVisual() {
  return (
    <div className="absolute inset-0 bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_30%,transparent),transparent_64%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--primary)_18%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--primary)_18%,transparent)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70" />
      <div className="absolute left-8 top-8 h-24 w-24 rounded-2xl border border-primary/60 bg-primary/25" />
      <div className="absolute right-10 bottom-12 h-40 w-40 rounded-full border border-primary/40" />
      <div className="absolute right-16 top-16 size-3 rounded-full bg-accent" />
      <div className="absolute bottom-16 left-16 h-1.5 w-16 rounded-full bg-accent" />
      <p className="absolute bottom-8 left-8 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/70">
        Computing Yard
      </p>
    </div>
  );
}
