"use client";

import { motion } from "framer-motion";
import {
  AppWindow,
  Braces,
  Cloud,
  Component,
  Container as ContainerIcon,
  Cylinder,
  Database,
  FileCode2,
  Flame,
  Layers,
  Monitor,
  Route,
  Server,
  Smartphone,
  Sparkles,
  Table2,
  TabletSmartphone,
  Wind,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const groups: {
  title: string;
  icon: LucideIcon;
  items: { name: string; icon: LucideIcon }[];
}[] = [
  {
    title: "Frontend",
    icon: Monitor,
    items: [
      { name: "React", icon: Component },
      { name: "Next.js", icon: AppWindow },
      { name: "TypeScript", icon: FileCode2 },
      { name: "Tailwind CSS", icon: Wind },
    ],
  },
  {
    title: "Backend",
    icon: Server,
    items: [
      { name: "Node.js", icon: Server },
      { name: "Python", icon: Braces },
      { name: "NestJS", icon: Layers },
      { name: "Express.js", icon: Route },
    ],
  },
  {
    title: "Mobile",
    icon: Smartphone,
    items: [
      { name: "React Native", icon: Smartphone },
      { name: "Flutter", icon: TabletSmartphone },
    ],
  },
  {
    title: "Database",
    icon: Database,
    items: [
      { name: "PostgreSQL", icon: Database },
      { name: "MongoDB", icon: Cylinder },
      { name: "MySQL", icon: Table2 },
    ],
  },
  {
    title: "AI & Cloud",
    icon: Cloud,
    items: [
      { name: "OpenAI", icon: Sparkles },
      { name: "AWS", icon: Cloud },
      { name: "Firebase", icon: Flame },
      { name: "Docker", icon: ContainerIcon },
    ],
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
                  <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-white">
                    {group.title}
                  </h3>
                </div>

                <ul className="flex flex-wrap gap-3">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;

                    return (
                      <li key={item.name}>
                        <span className="group inline-flex items-center gap-2.5 rounded-xl border border-border bg-[#1A202C] px-3.5 py-2.5 text-sm text-white/90 transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-white">
                          <ItemIcon
                            className="size-4 text-primary transition-colors duration-200 group-hover:text-accent"
                            aria-hidden="true"
                          />
                          {item.name}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
