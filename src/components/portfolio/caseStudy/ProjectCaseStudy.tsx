import { CaseStudyApproach } from "@/components/portfolio/caseStudy/CaseStudyApproach";
import { CaseStudyBrand } from "@/components/portfolio/caseStudy/CaseStudyBrand";
import { CaseStudyChallenges } from "@/components/portfolio/caseStudy/CaseStudyChallenges";
import { CaseStudyCta } from "@/components/portfolio/caseStudy/CaseStudyCta";
import { CaseStudyGallery } from "@/components/portfolio/caseStudy/CaseStudyGallery";
import { CaseStudyHero } from "@/components/portfolio/caseStudy/CaseStudyHero";
import { CaseStudyItemGrid } from "@/components/portfolio/caseStudy/CaseStudyItemGrid";
import { CaseStudyMoreWork } from "@/components/portfolio/caseStudy/CaseStudyMoreWork";
import { CaseStudyOverview } from "@/components/portfolio/caseStudy/CaseStudyOverview";
import { CaseStudyTestimonial } from "@/components/portfolio/caseStudy/CaseStudyTestimonial";
import { MobileAppCaseStudy } from "@/components/portfolio/caseStudy/MobileAppCaseStudy";
import { ProjectThemeShell } from "@/components/portfolio/caseStudy/ProjectThemeShell";
import { WebAppCaseStudy } from "@/components/portfolio/caseStudy/WebAppCaseStudy";
import {
  isMobileAppProject,
  isWebAppProject,
} from "@/components/portfolio/caseStudy/helpers";
import type { CaseStudyProject, FeaturedProject } from "@/types/sanity";

type ProjectCaseStudyProps = {
  project: CaseStudyProject;
  relatedProjects?: FeaturedProject[];
};

export function ProjectCaseStudy({
  project,
  relatedProjects = [],
}: ProjectCaseStudyProps) {
  if (isMobileAppProject(project)) {
    return (
      <ProjectThemeShell project={project}>
        <MobileAppCaseStudy
          project={project}
          relatedProjects={relatedProjects}
        />
      </ProjectThemeShell>
    );
  }

  if (isWebAppProject(project)) {
    return (
      <ProjectThemeShell project={project}>
        <WebAppCaseStudy project={project} relatedProjects={relatedProjects} />
      </ProjectThemeShell>
    );
  }

  return (
    <ProjectThemeShell project={project}>
      <article className="overflow-x-hidden bg-background">
        <CaseStudyHero project={project} />
        <CaseStudyOverview project={project} />
        <CaseStudyBrand project={project} />
        <CaseStudyItemGrid
        eyebrow="Objectives"
        title="Project Goals"
        items={project.projectGoals}
      />
      <CaseStudyGallery images={project.gallery} projectTitle={project.title} />
      <CaseStudyChallenges
        challenges={project.challenges}
        mockupImage={
          project.thumbnail || project.gallery?.[0] || project.cardImage
        }
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
    </ProjectThemeShell>
  );
}
