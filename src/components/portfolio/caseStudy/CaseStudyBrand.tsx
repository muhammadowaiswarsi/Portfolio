"use client";

import { motion } from "framer-motion";

import { fadeUp, hasText } from "@/components/portfolio/caseStudy/helpers";
import { useColorMode } from "@/components/theme/ColorModeProvider";
import { Container } from "@/components/ui/Container";
import { getProjectPalette, hasCompleteTheme, contrastText } from "@/lib/project-theme";
import type { CaseStudyProject } from "@/types/sanity";

type CaseStudyBrandProps = {
  project: CaseStudyProject;
};

const PREVIEW =
  "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 0123456789";

function Swatch({
  label,
  color,
  textColor,
}: {
  label: string;
  color: string;
  textColor: string;
}) {
  return (
    <div
      className="relative min-h-[9.5rem] overflow-hidden rounded-2xl border border-border shadow-[0_16px_40px_rgba(0,0,0,0.12)] sm:min-h-[11rem]"
      style={{ backgroundColor: color, color: textColor }}
    >
      <p className="absolute top-4 left-4 text-[11px] font-medium uppercase tracking-[0.18em] opacity-80">
        {label}
      </p>
      <p className="absolute bottom-4 left-4 font-medium tracking-wide">
        {color.toUpperCase()}
      </p>
    </div>
  );
}

export function CaseStudyBrand({ project }: CaseStudyBrandProps) {
  const { mode } = useColorMode();
  const palette = getProjectPalette(project, mode);
  const fontName = hasText(project.typography?.fontFamily)
    ? project.typography.fontFamily
    : null;

  if (
    !hasCompleteTheme(project.lightTheme) &&
    !hasCompleteTheme(project.darkTheme) &&
    !fontName
  ) {
    return null;
  }

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container className="space-y-16 sm:space-y-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0.06}
          variants={fadeUp}
        >
          <div className="mb-8 flex items-end gap-4">
            <h2 className="font-display text-2xl font-semibold tracking-[0.08em] text-foreground sm:text-3xl">
              THEME
            </h2>
            <span className="mb-2 h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            <Swatch
              label="Primary"
              color={palette.primary}
              textColor={contrastText(palette.primary)}
            />
            <Swatch
              label="Secondary"
              color={palette.secondary}
              textColor={contrastText(palette.secondary)}
            />
            <Swatch
              label="Background"
              color={palette.background}
              textColor={palette.text}
            />
          </div>
        </motion.div>

        {fontName ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0.1}
            variants={fadeUp}
          >
            <div className="mb-8 flex items-end gap-4">
              <h2 className="font-display text-2xl font-semibold tracking-[0.08em] text-foreground sm:text-3xl">
                TYPOGRAPHY
              </h2>
              <span className="mb-2 h-px flex-1 bg-border" />
            </div>
            <p className="font-display text-5xl font-semibold tracking-[-0.03em] text-foreground sm:text-6xl lg:text-7xl">
              {fontName}
            </p>
            <p className="mt-6 max-w-5xl text-base leading-9 text-muted sm:text-lg sm:leading-10 lg:text-xl lg:leading-[2.4rem]">
              {PREVIEW}
            </p>
          </motion.div>
        ) : null}
      </Container>
    </section>
  );
}
