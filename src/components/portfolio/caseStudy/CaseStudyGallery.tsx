"use client";

import { motion } from "framer-motion";

import { LaptopMockup } from "@/components/portfolio/caseStudy/LaptopMockup";
import {
  getImageUrl,
  hasImage,
  hasItems,
} from "@/components/portfolio/caseStudy/helpers";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import type { SanityImage } from "@/types/sanity";

type CaseStudyGalleryProps = {
  images?: SanityImage[] | null;
  projectTitle: string;
};

export function CaseStudyGallery({
  images,
  projectTitle,
}: CaseStudyGalleryProps) {
  const gallery = (hasItems(images) ? images : []).filter(hasImage);

  if (gallery.length === 0) return null;

  const single = gallery.length === 1;

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading eyebrow="Visuals" title="Project Gallery" />

        <div
          className={
            single
              ? "mx-auto mt-12 max-w-3xl"
              : "mt-12 grid gap-10 sm:grid-cols-2 sm:gap-8 lg:gap-12"
          }
        >
          {gallery.map((image, index) => {
            const imageUrl = getImageUrl(image, 1600, 1000);
            if (!imageUrl) return null;

            return (
              <motion.figure
                key={image.asset._ref || index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.06,
                  ease: "easeOut",
                }}
                className={cn(
                  "relative",
                  !single && index === 2 && gallery.length === 3
                    ? "sm:col-span-2 sm:mx-auto sm:max-w-xl"
                    : "",
                )}
              >
                <div
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-6 rounded-[2rem] bg-primary/30 sm:inset-8",
                    index % 2 === 0 ? "-rotate-3" : "rotate-3",
                  )}
                />
                <div
                  className={cn(
                    "relative",
                    index % 2 === 0 ? "lg:-rotate-2" : "lg:rotate-2",
                  )}
                >
                  <LaptopMockup
                    src={imageUrl}
                    alt={
                      image.alt || `${projectTitle} gallery image ${index + 1}`
                    }
                    sizes={
                      single
                        ? "(min-width: 1280px) 768px, 100vw"
                        : "(min-width: 768px) 42vw, 100vw"
                    }
                  />
                </div>
              </motion.figure>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
