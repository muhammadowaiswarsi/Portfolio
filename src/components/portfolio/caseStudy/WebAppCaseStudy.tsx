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

type WebAppCaseStudyProps = {
  project: CaseStudyProject;
  relatedProjects?: FeaturedProject[];
};

export function WebAppCaseStudy({
  project,
  relatedProjects = [],
}: WebAppCaseStudyProps) {
  return (
    <article className="overflow-x-hidden bg-background">
      <WebAppHero project={project} />
      <CaseStudyOverview
        project={project}
        eyebrow="The Platform"
        heading="About the Web App"
      />
      <CaseStudyBrand project={project} />
      <CaseStudyItemGrid
        eyebrow="Objectives"
        title="Project Goals"
        items={project.projectGoals}
      />
      <WebAppScreens images={project.gallery} projectTitle={project.title} />
      <CaseStudyChallenges
        challenges={project.challenges}
        mockupImage={
          project.slug === "traino-ai" || project.slug === "tms-system"
            ? (project.gallery ?? []).find((image) =>
                /create training|platform admin|load info/i.test(image.alt || ""),
              ) || project.gallery?.[0]
            : undefined
        }
        projectTitle={project.title}
      />
      <CaseStudyApproach items={project.approach} />
      <CaseStudyItemGrid
        eyebrow="Highlights"
        title="Key Features"
        items={project.keyFeatures}
        imageFit={
          project.slug === "traino-ai" || project.slug === "tms-system"
            ? "contain"
            : "cover"
        }
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
