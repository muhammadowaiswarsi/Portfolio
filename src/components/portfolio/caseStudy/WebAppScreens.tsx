"use client";

import { motion } from "framer-motion";

import { LaptopMockup } from "@/components/portfolio/caseStudy/LaptopMockup";
import { PhoneMockup } from "@/components/portfolio/caseStudy/PhoneMockup";
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
  const parts = alt.split(/[—–]/).map((part) => part.trim());
  return parts.slice(1).join(" — ") || parts[0] || fallback;
}

function isMobileShot(image: SanityImage) {
  return /^mobile\b/i.test(image.alt || "");
}

export function WebAppScreens({ images, projectTitle }: WebAppScreensProps) {
  const gallery = (hasItems(images) ? images : []).filter(hasImage);
  const desktop = gallery.filter((image) => !isMobileShot(image));
  const mobile = gallery.filter(isMobileShot);

  if (desktop.length === 0 && mobile.length === 0) return null;

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        {desktop.length > 0 ? (
          <>
            <SectionHeading
              eyebrow="Product Screens"
              title="Inside the platform"
              description="Key workflows from the web application, shown at desktop scale so the product interface stays readable."
              headingClassName="font-display font-semibold"
            />

            <div className="mt-14 space-y-16 lg:space-y-20">
              {desktop.map((image, index) => {
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
          </>
        ) : null}

        {mobile.length > 0 ? (
          <div className={desktop.length > 0 ? "mt-20 border-t border-border pt-16 sm:mt-24 sm:pt-20" : ""}>
            <SectionHeading
              eyebrow="Responsive"
              title="Built for smaller screens"
              description="The same product on mobile, shown in phone frames so the responsive layout stays clear."
              headingClassName="font-display font-semibold"
            />
            <div className="mt-14 grid justify-items-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {mobile.map((image, index) => {
                const imageUrl = getImageUrl(image, 1200);
                if (!imageUrl) return null;

                return (
                  <motion.div
                    key={image.asset._ref || `mobile-${index}`}
                    className="w-full max-w-[18rem]"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
                  >
                    <PhoneMockup
                      src={imageUrl}
                      alt={
                        image.alt || `${projectTitle} mobile screen ${index + 1}`
                      }
                      caption={caption(image.alt, `Screen ${index + 1}`)}
                      fit="cover"
                      sizes="(min-width: 1024px) 280px, 70vw"
                      className="max-w-none"
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
