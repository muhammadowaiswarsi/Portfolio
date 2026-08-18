import { ArrowUpRight } from "lucide-react";

import { FeaturedProjectCard } from "@/components/sections/FeaturedProjectCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFeaturedProjects } from "@/sanity/lib/projects";

export async function FeaturedPortfolio() {
  const projects = await getFeaturedProjects();

  return (
    <section className="border-t border-border bg-background py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="OUR WORK"
            title="Selected Projects"
            description="A look at some of the digital products and solutions we've built for our clients."
          />
          <Button href="/portfolio" className="w-fit shrink-0">
            View All Projects
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Button>
        </div>

        {projects.length > 0 ? (
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {projects.map((project, index) => (
              <FeaturedProjectCard
                key={project._id}
                project={project}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="mt-14 rounded-2xl border border-border bg-surface px-6 py-16 text-center sm:py-20">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
              Coming Soon
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted sm:text-base sm:leading-7">
              Featured projects will appear here once they are published in
              Sanity.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
