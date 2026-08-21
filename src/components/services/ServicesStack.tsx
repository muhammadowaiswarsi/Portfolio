"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getTechMeta } from "@/lib/technologies";
import { cn } from "@/lib/cn";

const categories = [
  {
    id: "frontend",
    label: "Frontend",
    items: ["Next.js", "React", "TypeScript", "JavaScript", "Tailwind CSS", "HTML"],
  },
  {
    id: "backend",
    label: "Backend",
    items: ["Node.js", "NestJS", "Express.js", "GraphQL", "Python"],
  },
  {
    id: "database",
    label: "Database",
    items: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
  },
  {
    id: "cloud",
    label: "Cloud",
    items: ["AWS", "Firebase", "Docker", "Vercel"],
  },
  {
    id: "uiux",
    label: "UI / UX",
    items: ["Tailwind CSS", "Framer Motion", "CSS"],
  },
  {
    id: "cms",
    label: "CMS",
    items: ["Sanity", "WordPress"],
  },
] as const;

export function ServicesStack() {
  const [activeId, setActiveId] = useState<(typeof categories)[number]["id"]>(
    "frontend",
  );
  const active = categories.find((category) => category.id === activeId) ?? categories[0];

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          align="center"
          title="Our Technology Stack"
          description="We choose proven, modern technologies based on the product, the team and the long-term needs of the business."
          className="mx-auto"
          headingClassName="font-display font-semibold"
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {categories.map((category) => {
            const selected = category.id === activeId;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveId(category.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  selected
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-surface text-foreground hover:border-primary",
                )}
                aria-pressed={selected}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <motion.ul
          key={active.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          {active.items.map((item) => {
            const { label, icon: Icon } = getTechMeta(item);

            return (
              <li key={item}>
                <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface px-4 py-7 text-center transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent">
                  <Icon className="size-8 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium text-foreground/90">
                    {label}
                  </span>
                </div>
              </li>
            );
          })}
        </motion.ul>
      </Container>
    </section>
  );
}
