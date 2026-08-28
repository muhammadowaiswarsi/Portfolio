"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { LaptopMockup } from "@/components/portfolio/caseStudy/LaptopMockup";
import { ShowcaseFrame } from "@/components/portfolio/caseStudy/ShowcaseFrame";
import {
  caseStudyTitleClass,
  fadeUp,
  getImageUrl,
  hasImage,
  hasText,
  isGraphicShowcase,
  isFrontendProject,
  isWebMobileProject,
} from "@/components/portfolio/caseStudy/helpers";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { CaseStudyProject } from "@/types/sanity";

type WebAppHeroProps = {
  project: CaseStudyProject;
  presentation?: "web-app" | "e-commerce" | "web-mobile";
};

export function WebAppHero({
  project,
  presentation = "web-app",
}: WebAppHeroProps) {
  const ecommerce = presentation === "e-commerce";
  const webMobile =
    presentation === "web-mobile" || isWebMobileProject(project);
  const frontend = isFrontendProject(project);
  const eyebrow = hasText(project.industry)
    ? project.industry
    : ecommerce
      ? "E-commerce"
      : webMobile
        ? "Web & Mobile App"
        : frontend
          ? "Educational Platform"
          : "Web Application";
  const liveUrl = hasText(project.liveUrl) ? project.liveUrl : null;
  const heroImage =
    (hasImage(project.thumbnail) ? project.thumbnail : null) ||
    (project.gallery ?? []).find(hasImage) ||
    project.cardImage;
  const heroUrl = hasImage(heroImage)
    ? getImageUrl(
        heroImage,
        project.slug === "health-share" || project.slug === "share-accountz"
          ? 1600
          : 1800,
      )
    : null;
  const heroAlt = heroImage?.alt || project.title;
  const backgroundUrl =
    getImageUrl(
      project.thumbnail,
      project.slug === "health-share" || project.slug === "share-accountz"
        ? 1600
        : 1920,
    ) || heroUrl;
  const landingHero =
    ecommerce ||
    project.slug === "traino-ai" ||
    project.slug === "tms-system" ||
    project.slug === "askademia";
  const graphicHero =
    isGraphicShowcase(heroImage) ||
    project.slug === "health-share" ||
    project.slug === "tms-system" ||
    project.slug === "study-panda" ||
    project.slug === "share-accountz" ||
    project.slug === "purchase-tracker-360";

  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      {backgroundUrl ? (
        <Image
          src={backgroundUrl}
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover opacity-[0.14] blur-[2px]"
          aria-hidden="true"
        />
      ) : null}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-background via-background/92 to-background"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--primary)_36%,transparent),transparent_58%)]"
      />

      <Container className="relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 lg:py-24">
        <div className="max-w-xl min-w-0">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.04}
            variants={fadeUp}
          >
            <Link
              href="/portfolio"
              className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/60 transition-colors hover:text-accent"
            >
              All Projects
            </Link>
          </motion.div>

          <motion.div
            className="mt-6 flex flex-wrap items-center gap-3"
            initial="hidden"
            animate="visible"
            custom={0.1}
            variants={fadeUp}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
              {eyebrow}
            </p>
            <span className="rounded-full border border-foreground/20 bg-foreground/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/80">
              {ecommerce
                ? "E-commerce"
                : webMobile
                  ? "Web & Mobile"
                  : frontend
                    ? "Frontend"
                    : "Web App"}
            </span>
          </motion.div>

          <motion.h1
            className={`mt-5 break-words text-4xl leading-[1.12] sm:text-5xl lg:text-[3.35rem] ${caseStudyTitleClass}`}
            initial="hidden"
            animate="visible"
            custom={0.16}
            variants={fadeUp}
          >
            {project.title}
          </motion.h1>

          {hasText(project.shortDescription) ? (
            <motion.p
              className="mt-6 max-w-lg text-base leading-7 text-foreground/78 sm:text-lg sm:leading-8"
              initial="hidden"
              animate="visible"
              custom={0.22}
              variants={fadeUp}
            >
              {project.shortDescription}
            </motion.p>
          ) : null}

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            initial="hidden"
            animate="visible"
            custom={0.28}
            variants={fadeUp}
          >
            <Button href="/contact" size="lg" className="rounded-full px-7">
              Start a Project
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Button>
            {liveUrl ? (
              <Button
                href={liveUrl}
                variant="secondary"
                size="lg"
                className="rounded-full px-7"
              >
                {ecommerce ? "Visit Live Store" : "Open Live Platform"}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Button>
            ) : null}
          </motion.div>
        </div>

        {heroUrl ? (
          <motion.div
            className="relative min-w-0 w-full"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: "easeOut" }}
          >
            {graphicHero ? (
              <ShowcaseFrame
                src={heroUrl}
                alt={heroAlt}
                priority
                layout="wide"
                sizes="(min-width: 1024px) 48vw, 100vw"
              />
            ) : (
              <LaptopMockup
                src={heroUrl}
                alt={heroAlt}
                priority
                fit={landingHero ? "cover" : "contain"}
                aspectClass={landingHero ? "aspect-[16/10]" : "aspect-[3/2]"}
                sizes="(min-width: 1024px) 48vw, 100vw"
              />
            )}
          </motion.div>
        ) : null}
      </Container>
    </section>
  );
}
