"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { fadeUp, hasText } from "@/components/services/landing/helpers";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ServiceLanding } from "@/types/sanity";

type ServiceLandingCtaProps = {
  service: ServiceLanding;
};

export function ServiceLandingCta({ service }: ServiceLandingCtaProps) {
  const title = hasText(service.ctaTitle)
    ? service.ctaTitle
    : "Let's Build Something Great Together.";
  const description = hasText(service.ctaDescription)
    ? service.ctaDescription
    : undefined;

  return (
    <section className="relative overflow-hidden border-t border-border py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--primary)_26%,transparent),transparent_64%)]"
      />
      <Container className="relative">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          custom={0.08}
          variants={fadeUp}
        >
          <SectionHeading
            align="center"
            title={title}
            description={description}
          />
          <div className="mt-8">
            <Button href="/contact" size="lg" className="rounded-full px-7">
              Let&apos;s Talk
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
