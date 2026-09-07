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

function typeClass(projectType: FeaturedProject["projectType"]) {
  if (projectType === "web-mobile") return "type-web type-mobile";
  if (projectType === "mobile-app") return "type-mobile";
  return "type-web";
}

export function PortfolioGrid({ projects }: PortfolioGridProps) {
  return (
    <div
      className={cn(
        "has-[#portfolio-filter-mobile-app:checked]:[&_.type-web:not(.type-mobile)]:hidden",
        "has-[#portfolio-filter-web-app:checked]:[&_.type-mobile:not(.type-web)]:hidden",
      )}
    >
      <div
        className="mb-12 flex flex-wrap justify-center gap-3"
        role="radiogroup"
        aria-label="Filter projects by type"
      >
        {FILTERS.map((filter, index) => (
          <label
            key={filter.id}
            className="cursor-pointer rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium tracking-wide text-foreground transition-colors duration-200 has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-accent-foreground hover:border-primary hover:bg-primary/10 has-[:checked]:hover:border-accent has-[:checked]:hover:bg-accent"
          >
            <input
              id={`portfolio-filter-${filter.id}`}
              type="radio"
              name="portfolio-filter"
              defaultChecked={index === 0}
              className="sr-only"
            />
            {filter.label}
          </label>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project._id}
            className={`portfolio-card ${typeClass(project.projectType)}`}
          >
            <FeaturedProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
