"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Image from "next/image";

import {
  caseStudySectionClass,
  fadeUp,
  getImageUrl,
  hasText,
} from "@/components/portfolio/caseStudy/helpers";
import { Container } from "@/components/ui/Container";
import type { ProjectClientTestimonial } from "@/types/sanity";

type CaseStudyTestimonialProps = {
  testimonial?: ProjectClientTestimonial | null;
};

export function CaseStudyTestimonial({
  testimonial,
}: CaseStudyTestimonialProps) {
  if (!testimonial || !hasText(testimonial.quote)) return null;

  const name = hasText(testimonial.name) ? testimonial.name : null;
  const role = hasText(testimonial.role) ? testimonial.role : null;
  const company = hasText(testimonial.company) ? testimonial.company : null;
  const roleLine = [role, company].filter(Boolean).join(" · ");
  const avatarUrl = getImageUrl(testimonial.avatar, 160, 160);
  const avatarAlt = testimonial.avatar?.alt || name || "Client";
  const rating =
    typeof testimonial.rating === "number"
      ? Math.min(5, Math.max(0, Math.round(testimonial.rating)))
      : 0;

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0.08}
          variants={fadeUp}
        >
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
            Client Testimonial
          </p>
          <Quote className="mx-auto size-8 text-accent" aria-hidden="true" />

          {rating > 0 ? (
            <div
              className="mt-5 flex justify-center gap-1"
              aria-label={`${rating} out of 5 stars`}
            >
              {Array.from({ length: 5 }, (_, starIndex) => (
                <Star
                  key={starIndex}
                  className={
                    starIndex < rating
                      ? "size-4 fill-accent text-accent"
                      : "size-4 text-primary"
                  }
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : null}

          <blockquote className={`mt-6 text-2xl leading-snug sm:text-3xl sm:leading-snug ${caseStudySectionClass}`}>
            {testimonial.quote}
          </blockquote>

          {name || roleLine || avatarUrl ? (
            <div className="mt-8 flex flex-col items-center gap-3">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={avatarAlt}
                  width={56}
                  height={56}
                  className="size-14 rounded-full object-cover"
                />
              ) : name ? (
                <span className="flex size-14 items-center justify-center rounded-full border border-primary/50 bg-primary/25 text-sm font-medium text-foreground">
                  {name.charAt(0)}
                </span>
              ) : null}
              {name ? (
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-foreground">
                  {name}
                </p>
              ) : null}
              {roleLine ? (
                <p className="text-sm text-muted">{roleLine}</p>
              ) : null}
            </div>
          ) : null}
        </motion.div>
      </Container>
    </section>
  );
}
