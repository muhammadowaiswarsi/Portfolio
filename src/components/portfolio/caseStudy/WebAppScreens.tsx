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
import type { SanityImage } from "@/types/sanity";

type WebAppScreensProps = {
  images?: SanityImage[] | null;
  projectTitle: string;
};

function caption(alt: string | undefined, fallback: string) {
  if (!alt) return fallback;
  return alt.split(/[—–]/)[0]?.trim() || fallback;
}

export function WebAppScreens({ images, projectTitle }: WebAppScreensProps) {
  const gallery = (hasItems(images) ? images : []).filter(hasImage);
  if (gallery.length === 0) return null;

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Product Screens"
          title="Inside the platform"
          description="Key workflows from the live web application, shown at desktop scale so the product interface stays readable."
          headingClassName="font-display font-semibold"
        />

        <div className="mt-14 space-y-16 lg:space-y-20">
          {gallery.map((image, index) => {
            const imageUrl = getImageUrl(image, 1800);
            if (!imageUrl) return null;

            return (
              <motion.figure
                key={image.asset._ref || index}
                className="min-w-0"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: 0.04, ease: "easeOut" }}
              >
                <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
                  {caption(image.alt, `Screen ${index + 1}`)}
                </p>
                <LaptopMockup
                  src={imageUrl}
                  alt={
                    image.alt || `${projectTitle} platform screen ${index + 1}`
                  }
                  fit="contain"
                  aspectClass="aspect-[3/2]"
                  sizes="(min-width: 1280px) 1100px, 100vw"
                />
              </motion.figure>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
