import { getProjectFontMeta } from "@/lib/project-fonts";
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
      {children}
    </ProjectThemeVars>
  );
}
