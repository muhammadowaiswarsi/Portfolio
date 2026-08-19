import type { CSSProperties } from "react";

import type { CaseStudyProject, ProjectColorTheme } from "@/types/sanity";

export type ColorMode = "light" | "dark";

export const COLOR_MODE_STORAGE_KEY = "cy-color-mode";

export type ResolvedColorTheme = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  mutedText: string;
  border: string;
  surface: string;
};

export const fallbackDarkTheme: ResolvedColorTheme = {
  primary: "#2C5270",
  secondary: "#F57B00",
  background: "#1A202C",
  text: "#FFFFFF",
  mutedText: "#B7C0CC",
  border: "#334155",
  surface: "#243044",
};

export const fallbackLightTheme: ResolvedColorTheme = {
  primary: "#2C5270",
  secondary: "#F57B00",
  background: "#FFFFFF",
  text: "#1A202C",
  mutedText: "#4A5568",
  border: "#D6DEE7",
  surface: "#F4F7FA",
};

const HEX = /^#([0-9A-Fa-f]{6})$/;

export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && HEX.test(value.trim());
}

function pick(
  theme: ProjectColorTheme | null | undefined,
  key: keyof ResolvedColorTheme,
  fallback: string,
) {
  const value = theme?.[key];
  return isHexColor(value) ? value.trim() : fallback;
}

export function resolveColorTheme(
  theme: ProjectColorTheme | null | undefined,
  mode: ColorMode,
): ResolvedColorTheme {
  const fallback = mode === "light" ? fallbackLightTheme : fallbackDarkTheme;

  return {
    primary: pick(theme, "primary", fallback.primary),
    secondary: pick(theme, "secondary", fallback.secondary),
    background: pick(theme, "background", fallback.background),
    text: pick(theme, "text", fallback.text),
    mutedText: pick(theme, "mutedText", fallback.mutedText),
    border: pick(theme, "border", fallback.border),
    surface: pick(theme, "surface", fallback.surface),
  };
}

export function contrastText(hex: string) {
  const value = hex.replace("#", "");
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  const luminance = (r * 299 + g * 587 + b * 114) / 1000;

  return luminance > 155 ? "#1A202C" : "#FFFFFF";
}

export function hasCompleteTheme(theme?: ProjectColorTheme | null) {
  if (!theme) return false;

  return (
    isHexColor(theme.primary) &&
    isHexColor(theme.secondary) &&
    isHexColor(theme.background)
  );
}

export function themeToCssVars(
  theme: ResolvedColorTheme,
  fontFamily: string,
  fontWeight: string,
): CSSProperties {
  return {
    "--background": theme.background,
    "--foreground": theme.text,
    "--primary": theme.primary,
    "--primary-hover": `color-mix(in srgb, ${theme.primary} 86%, ${contrastText(theme.primary)})`,
    "--primary-foreground": contrastText(theme.primary),
    "--accent": theme.secondary,
    "--accent-hover": `color-mix(in srgb, ${theme.secondary} 86%, ${contrastText(theme.secondary)})`,
    "--accent-foreground": contrastText(theme.secondary),
    "--muted": theme.mutedText,
    "--surface": theme.surface,
    "--border": theme.border,
    "--ring": theme.secondary,
    "--font-project": fontFamily,
    "--font-sans": fontFamily,
    "--font-display": fontFamily,
    "--project-font-weight": fontWeight,
  } as CSSProperties;
}

export function getProjectPalette(project: CaseStudyProject, mode: ColorMode) {
  return resolveColorTheme(
    mode === "light" ? project.lightTheme : project.darkTheme,
    mode,
  );
}
