"use client";

import { useMemo, useState } from "react";

import { FeaturedProjectCard } from "@/components/sections/FeaturedProjectCard";
import { cn } from "@/lib/cn";
import type { FeaturedProject } from "@/types/sanity";

type PortfolioGridProps = {
  projects: FeaturedProject[];
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "mobile-app", label: "Mobile Apps" },
  { id: "web-app", label: "Web Apps" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

function getProjectType(project: FeaturedProject) {
  return project.projectType === "mobile-app" || project.projectType === "web-app"
    ? project.projectType
    : null;
}

export function PortfolioGrid({ projects }: PortfolioGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const visibleProjects = useMemo(() => {
    if (activeFilter === "all") return projects;

    return projects.filter(
      (project) => getProjectType(project) === activeFilter,
    );
  }, [activeFilter, projects]);

  return (
    <div>
      <div
        className="mb-12 flex flex-wrap justify-center gap-3"
        aria-label="Filter projects by type"
      >
        {FILTERS.map((filter) => {
          const active = activeFilter === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition-colors duration-200",
                active
                  ? "bg-accent text-accent-foreground"
                  : "border border-border bg-surface text-foreground hover:border-primary hover:bg-primary/10",
              )}
              aria-pressed={active}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {visibleProjects.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project, index) => (
            <FeaturedProjectCard
              key={project._id}
              project={project}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center sm:py-20">
          <p className="text-sm text-muted sm:text-base">
            No projects in this category yet.
          </p>
        </div>
      )}
    </div>
  );
}
