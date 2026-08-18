import type { Metadata } from "next";

import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getAllProjects } from "@/sanity/lib/projects";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore a selection of digital products and solutions we've built for ambitious businesses.",
};

export default async function PortfolioPage() {
  const projects = await getAllProjects();

  return (
    <>
      <PortfolioHero />

      <section className="border-t border-border bg-background py-16 sm:py-20 lg:py-24">
        <Container>
          {projects.length > 0 ? (
            <PortfolioGrid projects={projects} />
          ) : (
            <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center sm:py-20">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
                Coming Soon
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted sm:text-base sm:leading-7">
                Projects will appear here once they are published in Sanity.
              </p>
              <Button href="/contact" className="mt-8 rounded-full">
                Start a Project
              </Button>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
