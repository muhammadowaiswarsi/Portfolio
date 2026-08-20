import { CaseStudyApproach } from "@/components/portfolio/caseStudy/CaseStudyApproach";
import { CaseStudyBrand } from "@/components/portfolio/caseStudy/CaseStudyBrand";
import { CaseStudyChallenges } from "@/components/portfolio/caseStudy/CaseStudyChallenges";
import { CaseStudyCta } from "@/components/portfolio/caseStudy/CaseStudyCta";
import { CaseStudyItemGrid } from "@/components/portfolio/caseStudy/CaseStudyItemGrid";
import { CaseStudyMoreWork } from "@/components/portfolio/caseStudy/CaseStudyMoreWork";
import { CaseStudyOverview } from "@/components/portfolio/caseStudy/CaseStudyOverview";
import { CaseStudyTestimonial } from "@/components/portfolio/caseStudy/CaseStudyTestimonial";
import { WebAppHero } from "@/components/portfolio/caseStudy/WebAppHero";
import { WebAppScreens } from "@/components/portfolio/caseStudy/WebAppScreens";
import type { CaseStudyProject, FeaturedProject } from "@/types/sanity";

type EcommerceCaseStudyProps = {
  project: CaseStudyProject;
  relatedProjects?: FeaturedProject[];
};

export function EcommerceCaseStudy({
  project,
  relatedProjects = [],
}: EcommerceCaseStudyProps) {
  return (
    <article className="overflow-x-hidden bg-background">
      <WebAppHero project={project} presentation="e-commerce" />
      <CaseStudyOverview
        project={project}
        eyebrow="The Store"
        heading="About the Store"
      />
      <CaseStudyBrand project={project} />
      <CaseStudyItemGrid
        eyebrow="Objectives"
        title="Project Goals"
        items={project.projectGoals}
      />
      <WebAppScreens
        images={project.gallery}
        projectTitle={project.title}
        eyebrow="Shopping Experience"
        title="Storefront and campaign flow"
        description="Homepage, merchandising, and campaign screens shown at desktop scale so the shopping interface stays readable."
      />
      <CaseStudyChallenges
        challenges={project.challenges}
        projectTitle={project.title}
      />
      <CaseStudyApproach items={project.approach} />
      <CaseStudyItemGrid
        eyebrow="Highlights"
        title="Key Features"
        items={project.keyFeatures}
      />
      <CaseStudyItemGrid
        eyebrow="Outcomes"
        title="Results"
        items={project.results}
        numbered
      />
      <CaseStudyTestimonial testimonial={project.testimonial} />
      <CaseStudyMoreWork projects={relatedProjects} />
      <CaseStudyCta />
    </article>
  );
}
