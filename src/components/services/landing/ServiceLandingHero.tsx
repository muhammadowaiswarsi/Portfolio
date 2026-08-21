"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  fadeUp,
  getImageUrl,
  hasImage,
  hasText,
} from "@/components/services/landing/helpers";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { ServiceLanding } from "@/types/sanity";

type ServiceLandingHeroProps = {
  service: ServiceLanding;
};

export function ServiceLandingHero({ service }: ServiceLandingHeroProps) {
  const title = hasText(service.heroTitle) ? service.heroTitle : service.title;
  const description = hasText(service.heroDescription)
    ? service.heroDescription
    : service.shortDescription;
  const iconUrl = hasImage(service.icon)
    ? getImageUrl(service.icon, 240, 240)
    : null;
  const visualAlt = service.icon?.alt || title;

  return (
    <section className="relative overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_srgb,var(--primary)_28%,transparent),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_48%)]"
      />

      <Container className="relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:py-24">
        <div className="max-w-xl">
          <motion.p
            className="mb-5 text-sm font-medium text-accent"
            initial="hidden"
            animate="visible"
            custom={0.04}
            variants={fadeUp}
          >
            <Link href="/" className="transition-colors hover:text-accent-hover">
              Home
            </Link>
            <span className="mx-2 text-muted">»</span>
            <Link
              href="/services"
              className="transition-colors hover:text-accent-hover"
            >
              Services
            </Link>
          </motion.p>

          <motion.p
            className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-accent"
            initial="hidden"
            animate="visible"
            custom={0.08}
            variants={fadeUp}
          >
            OUR SERVICES
          </motion.p>

          <motion.h1
            className="font-display text-4xl font-semibold leading-[1.12] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-[3.25rem]"
            initial="hidden"
            animate="visible"
            custom={0.12}
            variants={fadeUp}
          >
            {title}
          </motion.h1>

          <motion.p
            className="mt-6 text-base leading-7 text-muted sm:text-lg sm:leading-8"
            initial="hidden"
            animate="visible"
            custom={0.18}
            variants={fadeUp}
          >
            {description}
          </motion.p>

          <motion.div
            className="mt-8"
            initial="hidden"
            animate="visible"
            custom={0.24}
            variants={fadeUp}
          >
            <Button href="/contact" size="lg" className="rounded-full px-7">
              Let&apos;s Talk
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto aspect-square w-full max-w-[34rem] overflow-hidden rounded-[2rem] bg-primary"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: "easeOut" }}
        >
          <span
            aria-hidden="true"
            className="absolute top-8 left-8 size-24 rounded-3xl bg-white/10"
          />
          <span
            aria-hidden="true"
            className="absolute right-10 bottom-16 size-16 rounded-full border border-white/20"
          />
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/3 size-10 rounded-xl bg-accent/80"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-28 items-center justify-center rounded-[1.75rem] border border-white/20 bg-background/20 backdrop-blur-sm sm:size-32">
              {iconUrl ? (
                <Image
                  src={iconUrl}
                  alt={visualAlt}
                  width={96}
                  height={96}
                  priority
                  className="size-16 object-contain sm:size-20"
                />
              ) : (
                <span className="size-10 rounded-lg bg-accent" />
              )}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
