"use client";

import type { ReactNode } from "react";

import { useColorMode } from "@/components/theme/ColorModeProvider";
import {
  getProjectFontMeta,
  getProjectFontWeight,
} from "@/lib/project-fonts";
import { getProjectPalette, themeToCssVars } from "@/lib/project-theme";
import type { CaseStudyProject } from "@/types/sanity";

type ProjectThemeVarsProps = {
  project: CaseStudyProject;
  fontClassName: string;
  children: ReactNode;
};

export function ProjectThemeVars({
  project,
  fontClassName,
  children,
}: ProjectThemeVarsProps) {
  const { mode } = useColorMode();
  const palette = getProjectPalette(project, mode);
  const font = getProjectFontMeta(project.typography?.fontFamily);
  const fontWeight = getProjectFontWeight(project.typography?.fontWeight);
  const style = themeToCssVars(palette, font.cssVar, fontWeight);

  return (
    <div
      className={`project-theme ${fontClassName}`}
      data-color-mode={mode}
      style={{
        ...style,
        colorScheme: mode,
      }}
    >
      {children}
    </div>
  );
}
