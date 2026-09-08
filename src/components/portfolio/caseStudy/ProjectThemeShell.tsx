import { MixpanelEntityView } from "@/components/analytics/MixpanelEntityView";
import { getProjectFontMeta } from "@/lib/project-fonts";
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
  const font = getProjectFontMeta(project.typography?.fontFamily);

  return (
    <ProjectThemeVars project={project} fontClassName={font.className}>
      <MixpanelEntityView
        event={MIXPANEL_EVENTS.VIEWED_PROJECT}
        name={project.title}
        slug={project.slug}
      />
      {children}
    </ProjectThemeVars>
  );
}
