"use client";

import { useMemo, useState } from "react";

import { FeaturedProjectCard } from "@/components/sections/FeaturedProjectCard";
import { cn } from "@/lib/cn";
import type { FeaturedProject } from "@/types/sanity";

type PortfolioGridProps = {
  projects: FeaturedProject[];
};

function getCategory(project: FeaturedProject) {
  return typeof project.category === "string" && project.category.trim()
    ? project.category.trim()
    : null;
}

export function PortfolioGrid({ projects }: PortfolioGridProps) {
  const categories = useMemo(() => {
    const unique = new Set<string>();

    for (const project of projects) {
      const category = getCategory(project);
      if (category) unique.add(category);
    }

    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const [activeCategory, setActiveCategory] = useState("All");

  const visibleProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => getCategory(project) === activeCategory);

  return (
    <div>
      <div
        className="mb-12 flex flex-wrap justify-center gap-3"
        aria-label="Filter projects by category"
      >
        {["All", ...categories].map((category) => {
          const active = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition-colors duration-200",
                active
                  ? "bg-accent text-accent-foreground"
                  : "bg-primary/30 text-white hover:bg-primary/50",
              )}
              aria-pressed={active}
            >
              {category}
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
