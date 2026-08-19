"use client";

import { motion } from "framer-motion";
import { Target } from "lucide-react";

import { PhoneMockup } from "@/components/portfolio/caseStudy/PhoneMockup";
import {
  caseStudySectionClass,
  fadeUp,
  getImageUrl,
  hasImage,
  hasItems,
  hasText,
  isPhoneScreen,
} from "@/components/portfolio/caseStudy/helpers";
import { Container } from "@/components/ui/Container";
import type { CaseStudyChallenge, SanityImage } from "@/types/sanity";

type MobileAppChallengesProps = {
  challenges?: CaseStudyChallenge[] | null;
  images?: SanityImage[] | null;
  projectTitle: string;
};

export function MobileAppChallenges({
  challenges,
  images,
  projectTitle,
}: MobileAppChallengesProps) {
  const items = (hasItems(challenges) ? challenges : []).filter(
    (item) => hasText(item.title) && hasText(item.description),
  );

  if (items.length === 0) return null;

  const phoneImage =
    (images ?? []).find(isPhoneScreen) ||
    (images ?? []).find(hasImage) ||
    null;
  const mockupUrl = hasImage(phoneImage) ? getImageUrl(phoneImage, 1400) : null;
  const mockupAlt = phoneImage?.alt || `${projectTitle} app`;

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <div
          className={
            mockupUrl
              ? "grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16"
              : "max-w-3xl"
          }
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0.06}
            variants={fadeUp}
          >
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
              Challenges
            </p>
            <h2
              className={`text-4xl leading-[1.15] sm:text-5xl lg:text-[3.15rem] ${caseStudySectionClass}`}
            >
              Project <span className="text-accent">Challenges</span>
            </h2>

            <ul className="mt-10 space-y-7">
              {items.map((item, index) => (
                <li
                  key={item._key || `${item.title}-${index}`}
                  className="flex gap-4"
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/35 bg-accent/10 text-accent">
                    <Target className="size-3.5" aria-hidden="true" />
                  </span>
                  <p className="min-w-0 text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
                    <span className="font-semibold text-white">
                      {item.title}:
                    </span>{" "}
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>

          {mockupUrl ? (
            <motion.div
              className="relative mx-auto w-full max-w-[18rem] lg:max-w-[20rem]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
            >
              <div
                aria-hidden="true"
                className="absolute top-8 right-2 bottom-10 left-6 rounded-[2.5rem] bg-primary/30"
              />
              <div className="relative lg:rotate-3">
                <PhoneMockup
                  src={mockupUrl}
                  alt={mockupAlt}
                  sizes="(min-width: 1024px) 280px, 70vw"
                  className="max-w-none"
                />
              </div>
            </motion.div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
