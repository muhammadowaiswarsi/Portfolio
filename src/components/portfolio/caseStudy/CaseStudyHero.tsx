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
import { cn } from "@/lib/cn";
import type { CaseStudyProject, SanityImage } from "@/types/sanity";

type CaseStudyHeroProps = {
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

const AMI_HOMEPAGE_SHOT: HeroShot = {
  key: "ami-homepage",
  url: "/ami-homepage.jpg",
  alt: "Arabian Metal Industries homepage",
};

function collectHeroShots(project: CaseStudyProject): HeroShot[] {
  const shots: HeroShot[] = [];
  const seen = new Set<string>();

  const add = (image: SanityImage | null | undefined, fallbackAlt: string) => {
    if (!hasImage(image) || !image) return;
    const key = imageKey(image);
    if (seen.has(key)) return;
    const url = getImageUrl(image, 1600);
    if (!url) return;
    seen.add(key);
    shots.push({
      key,
      url,
      alt: image.alt || fallbackAlt,
    });
  };

  if (project.slug === "arabian-metal-industries-ami") {
    shots.push(AMI_HOMEPAGE_SHOT);
    seen.add(AMI_HOMEPAGE_SHOT.key);
  }

  add(project.thumbnail, project.title);
  if (project.gallery) {
    for (const image of project.gallery) {
      add(image, `${project.title} screenshot`);
    }
  }
  add(project.cardImage, project.title);

  return shots.slice(0, 3);
}

function ProjectTitle({ title }: { title: string }) {
  const dashed = title.match(/^(.*?)\s+[–—-]\s+(.*)$/);
  if (dashed) {
    return (
      <>
        <span className="text-accent">{dashed[1]}</span> {dashed[2]}
      </>
    );
  }

  const parenthetical = title.match(/^(.*?)\s+(\([^)]+\))$/);
  if (parenthetical) {
    return (
      <>
        {parenthetical[1]}{" "}
        <span className="text-accent">{parenthetical[2]}</span>
      </>
    );
  }

  return title;
}

function HeroShowcase({ shots }: { shots: HeroShot[] }) {
  const [primary, left, right] = shots;

  if (!primary) return null;

  if (!left && !right) {
    return (
      <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
        <LaptopMockup
          src={primary.url}
          alt={primary.alt}
          priority
          fit="contain"
          aspectClass="aspect-[16/9]"
          sizes="(min-width: 1024px) 42vw, 80vw"
        />
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-lg sm:h-[22rem] lg:h-[28rem] lg:max-w-none">
      {left ? (
        <div className="absolute top-[22%] left-0 hidden w-[48%] -rotate-12 sm:block">
          <LaptopMockup
            src={left.url}
            alt={left.alt}
            fit="contain"
            aspectClass="aspect-[16/9]"
            sizes="(min-width: 1024px) 280px, 40vw"
          />
        </div>
      ) : null}
      {right ? (
        <div className="absolute top-[22%] right-0 hidden w-[48%] rotate-12 sm:block">
          <LaptopMockup
            src={right.url}
            alt={right.alt}
            fit="contain"
            aspectClass="aspect-[16/9]"
            sizes="(min-width: 1024px) 280px, 40vw"
          />
        </div>
      ) : null}
      <div
        className={cn(
          "relative z-10 mx-auto w-[92%] sm:absolute sm:top-[4%] sm:left-1/2 sm:w-[68%] sm:-translate-x-1/2",
          !left && !right ? "sm:static sm:w-full sm:translate-x-0" : "",
        )}
      >
        <LaptopMockup
          src={primary.url}
          alt={primary.alt}
          priority
          fit="cover"
          aspectClass="aspect-[16/9]"
          sizes="(min-width: 1024px) 420px, 80vw"
        />
      </div>
    </div>
  );
}

export function CaseStudyHero({ project }: CaseStudyHeroProps) {
  const eyebrow = hasText(project.industry)
    ? project.industry
    : hasText(project.category)
      ? project.category
      : "Case Study";
  const liveUrl = hasText(project.liveUrl) ? project.liveUrl : null;
  const shots = collectHeroShots(project);
  const backgroundUrl =
    getImageUrl(project.thumbnail, 1920, 1200) || shots[0]?.url || null;
  const backgroundAlt = project.thumbnail?.alt || project.title;

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
          className="object-cover opacity-[0.22]"
          aria-hidden="true"
        />
      ) : null}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-primary/72"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_42%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,color-mix(in_srgb,var(--primary)_40%,transparent),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--primary)_14%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--primary)_14%,transparent)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_18%,transparent_78%)]"
      />

      <Container className="relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 lg:py-24 xl:py-28">
        <div className="max-w-xl">
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
            initial="hidden"
            animate="visible"
            custom={0.1}
            variants={fadeUp}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
              {eyebrow}
            </p>
            {project.featured ? (
              <span className="rounded-full border border-foreground/20 bg-foreground/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/80">
                Featured
              </span>
            ) : null}
          </motion.div>

          <motion.h1
            className={`mt-5 break-words text-4xl leading-[1.12] sm:text-5xl lg:text-[3.25rem] xl:text-[3.45rem] ${caseStudyTitleClass}`}
            initial="hidden"
            animate="visible"
            custom={0.16}
            variants={fadeUp}
          >
            <ProjectTitle title={project.title} />
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
                View Live Site
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Button>
            ) : null}
          </motion.div>
        </div>

        <motion.div
          className="relative min-w-0"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {shots.length > 0 ? (
            <HeroShowcase shots={shots} />
          ) : backgroundUrl ? (
            <div className="relative overflow-hidden rounded-2xl border border-border bg-primary/30 shadow-[0_28px_70px_rgba(0,0,0,0.35)]">
              <div className="relative aspect-[16/10]">
                <Image
                  src={backgroundUrl}
                  alt={backgroundAlt}
                  fill
                  priority
                  unoptimized
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}
        </motion.div>
      </Container>
    </section>
  );
}
