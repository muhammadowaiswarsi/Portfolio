"use client";

import { motion } from "framer-motion";

import { ProjectPortableText } from "@/components/portfolio/ProjectPortableText";
import { caseStudySectionClass, fadeUp, hasItems, hasText } from "@/components/portfolio/caseStudy/helpers";
import { Container } from "@/components/ui/Container";
import type { CaseStudyProject } from "@/types/sanity";

type CaseStudyOverviewProps = {
  project: CaseStudyProject;
};

function MetaBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border pt-5 first:border-t-0 first:pt-0">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
        {label}
      </p>
      <div className="mt-2 text-sm leading-6 text-white/90 sm:text-[15px] sm:leading-7">
        {children}
      </div>
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-md border border-primary/45 bg-primary/20 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white/80"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function CaseStudyOverview({ project }: CaseStudyOverviewProps) {
  const hasDescription = Boolean(project.description?.length);
  const services = (project.servicesProvided ?? []).filter(hasText);
  const technologies = (project.technologies ?? []).filter(hasText);
  const industry = hasText(project.industry) ? project.industry : null;
  const businessType = hasText(project.businessType)
    ? project.businessType
    : null;
  const duration = hasText(project.projectDuration)
    ? project.projectDuration
    : null;
  const team = hasText(project.team) ? project.team : null;
  const hasMeta =
    Boolean(industry) ||
    Boolean(businessType) ||
    services.length > 0 ||
    Boolean(duration) ||
    Boolean(team) ||
    technologies.length > 0;

  if (!hasDescription && !hasText(project.shortDescription) && !hasMeta) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        <div
          className={
            hasMeta
              ? "grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.6fr)] lg:items-start lg:gap-16"
              : "max-w-3xl"
          }
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0.08}
            variants={fadeUp}
          >
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
              Overview
            </p>
            <h2 className={`text-3xl leading-[1.15] sm:text-4xl ${caseStudySectionClass}`}>
              About the Project
            </h2>
            <div className="mt-6">
              {hasDescription ? (
                <ProjectPortableText value={project.description ?? []} />
              ) : (
                <p className="text-base leading-7 text-muted sm:text-lg sm:leading-8">
                  {project.shortDescription}
                </p>
              )}
            </div>
          </motion.div>

          {hasMeta ? (
            <motion.aside
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={0.16}
              variants={fadeUp}
              className="h-fit rounded-2xl border border-border bg-surface p-6 sm:sticky sm:top-28 sm:p-7"
            >
              <div className="space-y-5">
                {industry ? (
                  <MetaBlock label="Industry">{industry}</MetaBlock>
                ) : null}
                {businessType ? (
                  <MetaBlock label="Business Type">{businessType}</MetaBlock>
                ) : null}
                {services.length > 0 ? (
                  <MetaBlock label="Services Provided">
                    <TagList items={services} />
                  </MetaBlock>
                ) : null}
                {duration ? (
                  <MetaBlock label="Duration">{duration}</MetaBlock>
                ) : null}
                {team ? <MetaBlock label="Team">{team}</MetaBlock> : null}
                {hasItems(technologies) ? (
                  <MetaBlock label="Technologies">
                    <TagList items={technologies} />
                  </MetaBlock>
                ) : null}
              </div>
            </motion.aside>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
