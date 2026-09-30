/**
 * Project typography metadata only — no next/font imports.
 * Fonts are loaded once in src/app/layout.tsx so client components
 * never pull Turbopack Google-font modules (avoids module-not-found).
 */

const catalog: Record<string, { className: string; cssVar: string }> = {
  "Open Sans": { className: "", cssVar: "var(--font-open-sans)" },
  Roboto: { className: "", cssVar: "var(--font-roboto)" },
  Montserrat: { className: "", cssVar: "var(--font-montserrat)" },
  Inter: { className: "", cssVar: "var(--font-inter)" },
  Rubik: { className: "", cssVar: "var(--font-rubik)" },
  Syne: { className: "", cssVar: "var(--font-syne)" },
};

export function getProjectFontMeta(family?: string | null) {
  return (
    catalog[family ?? ""] ?? {
      className: "",
      cssVar: "var(--font-geist-sans)",
    }
  );
}

export function getProjectFontWeight(weight?: string | null) {
  if (weight === "400" || weight === "500" || weight === "600" || weight === "700") {
    return weight;
  }

  return "600";
}
