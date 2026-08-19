"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PhoneMockup } from "@/components/portfolio/caseStudy/PhoneMockup";
import {
  caseStudyTitleClass,
  fadeUp,
  getImageUrl,
  hasImage,
  hasText,
  isPhoneScreen,
} from "@/components/portfolio/caseStudy/helpers";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import type { CaseStudyProject, SanityImage } from "@/types/sanity";

type MobileAppHeroProps = {
  project: CaseStudyProject;
};

type HeroShot = {
  key: string;
  url: string;
  alt: string;
};

function imageKey(image: SanityImage) {
  return image.asset._ref;
}

function collectHeroShots(project: CaseStudyProject): HeroShot[] {
  const shots: HeroShot[] = [];
  const seen = new Set<string>();

  const add = (image: SanityImage | null | undefined, fallbackAlt: string) => {
    if (!hasImage(image) || !image) return;
    const key = imageKey(image);
    if (seen.has(key)) return;
    const url = getImageUrl(image, 1400);
    if (!url) return;
    seen.add(key);
    shots.push({
      key,
      url,
      alt: image.alt || fallbackAlt,
    });
  };

  const gallery = project.gallery ?? [];
  const phoneImages = gallery.filter(isPhoneScreen);
  const preferred =
    phoneImages.length > 0
      ? phoneImages
      : [project.thumbnail, ...gallery, project.cardImage];

  for (const image of preferred) {
    add(image, `${project.title} app screen`);
  }

  return shots.slice(0, 3);
}

function HeroPhones({ shots }: { shots: HeroShot[] }) {
  const [primary, left, right] = shots;
  if (!primary) return null;

  if (!left && !right) {
    return (
      <div className="relative mx-auto w-[min(100%,19rem)]">
        <PhoneMockup
          src={primary.url}
          alt={primary.alt}
          priority
          sizes="(min-width: 1024px) 320px, 70vw"
        />
      </div>
    );
  }

  return (
    <div className="relative mx-auto min-h-[26rem] w-full max-w-lg sm:min-h-[32rem] lg:max-w-none lg:min-h-[36rem]">
      {left ? (
        <div className="absolute top-[18%] left-0 hidden w-[42%] -rotate-12 sm:block">
          <PhoneMockup
            src={left.url}
            alt={left.alt}
            sizes="(min-width: 1024px) 220px, 32vw"
            className="max-w-none"
          />
        </div>
      ) : null}
      {right ? (
        <div className="absolute top-[16%] right-0 hidden w-[42%] rotate-12 sm:block">
          <PhoneMockup
            src={right.url}
            alt={right.alt}
            sizes="(min-width: 1024px) 220px, 32vw"
            className="max-w-none"
          />
        </div>
      ) : null}
      <div
        className={cn(
          "relative z-10 mx-auto w-[72%] max-w-[19rem] sm:absolute sm:top-0 sm:left-1/2 sm:w-[46%] sm:max-w-none sm:-translate-x-1/2",
        )}
      >
        <PhoneMockup
          src={primary.url}
          alt={primary.alt}
          priority
          sizes="(min-width: 1024px) 280px, 60vw"
          className="max-w-none"
        />
      </div>
    </div>
  );
}

export function MobileAppHero({ project }: MobileAppHeroProps) {
  const eyebrow = hasText(project.industry)
    ? project.industry
    : hasText(project.category)
      ? project.category
      : "Mobile App";
  const liveUrl = hasText(project.liveUrl) ? project.liveUrl : null;
  const shots = collectHeroShots(project);
  const backgroundUrl =
    getImageUrl(project.thumbnail, 1920) || shots[0]?.url || null;

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
          className="object-cover opacity-[0.16] blur-sm"
          aria-hidden="true"
        />
      ) : null}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#1A202C] via-[#1A202C]/92 to-[#1A202C]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,#2C5270_34%,transparent),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,color-mix(in_srgb,#F57B00_14%,transparent),transparent_42%)]"
      />

      <Container className="relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 lg:py-24 xl:py-28">
        <div className="max-w-xl">
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
              Mobile App
            </span>
          </motion.div>

          <motion.h1
            className={`mt-5 break-words text-4xl leading-[1.12] sm:text-5xl lg:text-[3.35rem] xl:text-[3.6rem] ${caseStudyTitleClass}`}
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
                Open Live App
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Button>
            ) : null}
          </motion.div>
        </div>

        <motion.div
          className="relative min-w-0 overflow-hidden"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {shots.length > 0 ? <HeroPhones shots={shots} /> : null}
        </motion.div>
      </Container>
    </section>
  );
}
