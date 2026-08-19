"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { LaptopMockup } from "@/components/portfolio/caseStudy/LaptopMockup";
import {
  caseStudyTitleClass,
  fadeUp,
  getImageUrl,
  hasImage,
  hasText,
} from "@/components/portfolio/caseStudy/helpers";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { CaseStudyProject } from "@/types/sanity";

type WebAppHeroProps = {
  project: CaseStudyProject;
};

export function WebAppHero({ project }: WebAppHeroProps) {
  const eyebrow = hasText(project.industry)
    ? project.industry
    : "Web Application";
  const liveUrl = hasText(project.liveUrl) ? project.liveUrl : null;
  const heroImage =
    (hasImage(project.thumbnail) ? project.thumbnail : null) ||
    (project.gallery ?? []).find(hasImage) ||
    project.cardImage;
  const heroUrl = hasImage(heroImage) ? getImageUrl(heroImage, 1800) : null;
  const heroAlt = heroImage?.alt || project.title;
  const backgroundUrl = getImageUrl(project.thumbnail, 1920) || heroUrl;

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
        className="absolute inset-0 bg-gradient-to-b from-[#1A202C] via-[#1A202C]/92 to-[#1A202C]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,#2C5270_36%,transparent),transparent_58%)]"
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
              className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60 transition-colors hover:text-accent"
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
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/80">
              Web App
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
              className="mt-6 max-w-lg text-base leading-7 text-white/78 sm:text-lg sm:leading-8"
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
                Open Live Platform
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
            <LaptopMockup
              src={heroUrl}
              alt={heroAlt}
              priority
              fit="contain"
              aspectClass="aspect-[3/2]"
              sizes="(min-width: 1024px) 48vw, 100vw"
            />
          </motion.div>
        ) : null}
      </Container>
    </section>
  );
}
