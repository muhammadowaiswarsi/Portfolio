"use client";

import { FeaturedProjectCard } from "@/components/sections/FeaturedProjectCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { FeaturedProject } from "@/types/sanity";

type CaseStudyMoreWorkProps = {
  projects: FeaturedProject[];
};

export function CaseStudyMoreWork({ projects }: CaseStudyMoreWorkProps) {
  if (projects.length === 0) return null;

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading eyebrow="Portfolio" title="More Projects" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
          {projects.map((project, index) => (
            <FeaturedProjectCard
              key={project._id}
              project={project}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
