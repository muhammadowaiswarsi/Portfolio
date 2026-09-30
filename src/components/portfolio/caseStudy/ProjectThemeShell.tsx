import { MixpanelEntityView } from "@/components/analytics/MixpanelEntityView";
import { MIXPANEL_EVENTS } from "@/lib/mixpanel-events";
import { ProjectThemeVars } from "@/components/portfolio/caseStudy/ProjectThemeVars";
import type { CaseStudyProject } from "@/types/sanity";

type ProjectThemeShellProps = {
  project: CaseStudyProject;
  children: React.ReactNode;
};

export function ProjectThemeShell({
  project,
  children,
}: ProjectThemeShellProps) {
  return (
    <ProjectThemeVars project={project} fontClassName="">
      <MixpanelEntityView
        event={MIXPANEL_EVENTS.VIEWED_PROJECT}
        name={project.title}
        slug={project.slug}
      />
      {children}
    </ProjectThemeVars>
  );
}
