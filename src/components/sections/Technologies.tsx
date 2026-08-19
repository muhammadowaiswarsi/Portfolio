"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  Database,
  Monitor,
  Server,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechChip } from "@/components/ui/TechChip";

const groups: {
  title: string;
  icon: LucideIcon;
  items: string[];
}[] = [
  {
    title: "Frontend",
    icon: Monitor,
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Backend",
    icon: Server,
    items: ["Node.js", "Python", "NestJS", "Express.js"],
  },
  {
    title: "Mobile",
    icon: Smartphone,
    items: ["React Native", "Flutter"],
  },
  {
    title: "Database",
    icon: Database,
    items: ["PostgreSQL", "MongoDB", "MySQL"],
  },
  {
    title: "AI & Cloud",
    icon: Cloud,
    items: ["OpenAI", "AWS", "Firebase", "Docker"],
  },
];

export function Technologies() {
  return (
    <section className="border-t border-border bg-background py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="OUR TECHNOLOGIES"
          title="Powered by Modern Technology"
          description="We use proven technologies and modern development tools to build fast, scalable and reliable digital products."
        />

        <div className="mt-14 space-y-5">
          {groups.map((group, groupIndex) => {
            const GroupIcon = group.icon;

            return (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: groupIndex * 0.06,
                  ease: "easeOut",
                }}
                className="rounded-2xl border border-border bg-surface p-5 sm:p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg border border-primary/50 bg-primary/20 text-accent">
                    <GroupIcon className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
                    {group.title}
                  </h3>
                </div>

                <ul className="flex flex-wrap gap-3">
                  {group.items.map((item) => (
                    <li key={item}>
                      <TechChip name={item} />
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
