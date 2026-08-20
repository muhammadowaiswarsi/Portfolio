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
import { isFrontendProject, isWebMobileProject } from "@/components/portfolio/caseStudy/helpers";
import type { CaseStudyProject, FeaturedProject } from "@/types/sanity";

type WebAppCaseStudyProps = {
  project: CaseStudyProject;
  relatedProjects?: FeaturedProject[];
};

export function WebAppCaseStudy({
  project,
  relatedProjects = [],
}: WebAppCaseStudyProps) {
  const webMobile = isWebMobileProject(project);
  const frontend = isFrontendProject(project);
  const containFeatureImages =
    project.slug === "traino-ai" ||
    project.slug === "tms-system" ||
    project.slug === "study-panda" ||
    project.slug === "share-accountz" ||
    project.slug === "askademia";

  return (
    <article className="overflow-x-hidden bg-background">
      <WebAppHero
        project={project}
        presentation={webMobile ? "web-mobile" : "web-app"}
      />
      <CaseStudyOverview
        project={project}
        eyebrow={
          frontend ? "The Work" : webMobile ? "The Product" : "The Platform"
        }
        heading={
          frontend
            ? "About the Frontend"
            : webMobile
              ? "About the Web & Mobile App"
              : "About the Web App"
        }
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
        eyebrow={
          frontend
            ? "Interface"
            : webMobile
              ? "Web & Mobile Experience"
              : "Product Screens"
        }
        title={
          frontend
            ? "Educational UI"
            : webMobile
              ? "Product screens"
              : "Inside the platform"
        }
        description={
          frontend
            ? "Landing and section screens from the Askademia frontend, shown at desktop scale so the interface stays readable."
            : webMobile
              ? "Landing, onboarding, dashboard, and sharing screens from the web and mobile product, shown so the actual interface stays readable."
              : "Key workflows from the web application, shown at desktop scale so the product interface stays readable."
        }
        mobileEyebrow={webMobile ? "Mobile" : "Responsive"}
        mobileTitle={webMobile ? "On the phone" : "Built for smaller screens"}
        mobileDescription={
          webMobile
            ? "The mobile experience, shown in phone frames so the app layout stays clear."
            : "The same product on mobile, shown in phone frames so the responsive layout stays clear."
        }
      />
      <CaseStudyChallenges
        challenges={project.challenges}
        mockupImage={
          project.slug === "traino-ai" ||
          project.slug === "tms-system" ||
          project.slug === "study-panda"
            ? (project.gallery ?? []).find((image) =>
                /create training|platform admin|load info|live recording|oreo/i.test(
                  image.alt || "",
                ),
              ) || project.gallery?.[0]
            : project.slug === "share-accountz"
              ? (project.gallery ?? []).find((image) =>
                  /dashboard/i.test(image.alt || ""),
                ) || project.gallery?.[0]
              : project.slug === "askademia"
                ? (project.gallery ?? []).find((image) =>
                    /explore|tutor search|classroom/i.test(image.alt || ""),
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
        imageFit={containFeatureImages ? "contain" : "cover"}
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
