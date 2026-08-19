import { CaseStudyApproach } from "@/components/portfolio/caseStudy/CaseStudyApproach";
import { CaseStudyBrand } from "@/components/portfolio/caseStudy/CaseStudyBrand";
import { CaseStudyCta } from "@/components/portfolio/caseStudy/CaseStudyCta";
import { CaseStudyItemGrid } from "@/components/portfolio/caseStudy/CaseStudyItemGrid";
import { CaseStudyMoreWork } from "@/components/portfolio/caseStudy/CaseStudyMoreWork";
import { CaseStudyOverview } from "@/components/portfolio/caseStudy/CaseStudyOverview";
import { CaseStudyTestimonial } from "@/components/portfolio/caseStudy/CaseStudyTestimonial";
import { MobileAppChallenges } from "@/components/portfolio/caseStudy/MobileAppChallenges";
import { MobileAppFeatures } from "@/components/portfolio/caseStudy/MobileAppFeatures";
import { MobileAppHero } from "@/components/portfolio/caseStudy/MobileAppHero";
import { MobileAppScreens } from "@/components/portfolio/caseStudy/MobileAppScreens";
import { imagesMatching } from "@/components/portfolio/caseStudy/helpers";
import type { CaseStudyProject, FeaturedProject } from "@/types/sanity";

type MobileAppCaseStudyProps = {
  project: CaseStudyProject;
  relatedProjects?: FeaturedProject[];
};

export function MobileAppCaseStudy({
  project,
  relatedProjects = [],
}: MobileAppCaseStudyProps) {
  const gallery = project.gallery ?? [];
  const challengeImages = imagesMatching(gallery, /^dashboard\b/i);

  return (
    <article className="overflow-x-hidden bg-background">
      <MobileAppHero project={project} />
      <CaseStudyOverview
        project={project}
        eyebrow="The Product"
        heading="About the App"
      />
      <CaseStudyBrand project={project} />
      <CaseStudyItemGrid
        eyebrow="Objectives"
        title="Project Goals"
        items={project.projectGoals}
      />
      <MobileAppScreens images={gallery} projectTitle={project.title} />
      <MobileAppChallenges
        challenges={project.challenges}
        images={challengeImages}
        projectTitle={project.title}
      />
      <CaseStudyApproach items={project.approach} />
      <MobileAppFeatures items={project.keyFeatures} />
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
