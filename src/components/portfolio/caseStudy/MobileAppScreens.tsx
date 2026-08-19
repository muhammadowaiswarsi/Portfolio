"use client";

import { motion } from "framer-motion";

import { PhoneMockup } from "@/components/portfolio/caseStudy/PhoneMockup";
import { ProductFrame } from "@/components/portfolio/caseStudy/ProductFrame";
import {
  firstMatching,
  getImageUrl,
  hasImage,
  hasItems,
} from "@/components/portfolio/caseStudy/helpers";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SanityImage } from "@/types/sanity";

type MobileAppScreensProps = {
  images?: SanityImage[] | null;
  projectTitle: string;
};

function caption(alt: string | undefined, fallback: string) {
  if (!alt) return fallback;
  return alt.split(/[—–]/)[0]?.trim() || fallback;
}

export function MobileAppScreens({
  images,
  projectTitle,
}: MobileAppScreensProps) {
  const gallery = hasItems(images) ? images.filter(hasImage) : [];
  if (gallery.length === 0) return null;

  const phones = [
    firstMatching(gallery, /^login\b/i),
    firstMatching(gallery, /^sign up\b/i),
    firstMatching(gallery, /^dashboard\b/i),
    firstMatching(gallery, /^analytics\b/i),
  ].filter((image): image is SanityImage => Boolean(image));

  const webScreens = [
    {
      image: firstMatching(gallery, /web dashboard/i),
      label: "Dashboard",
    },
    {
      image: firstMatching(gallery, /web analytics/i),
      label: "Analytics",
    },
    {
      image: firstMatching(gallery, /website — mobile marketing landing/i),
      label: "Home",
    },
  ].filter(
    (item): item is { image: SanityImage; label: string } =>
      Boolean(item.image),
  );

  if (phones.length === 0 && webScreens.length === 0) return null;

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="App Screens"
          title="Inside the product"
          description={`A look at the ${projectTitle} mobile app — login, sign up, dashboard and analytics — then the web platform.`}
          headingClassName="font-display font-semibold"
        />

        {phones.length > 0 ? (
          <div className="mt-14 grid justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {phones.map((image, index) => {
              const imageUrl = getImageUrl(image, 1200);
              if (!imageUrl) return null;

              return (
                <motion.div
                  key={image.asset._ref || index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.06,
                    ease: "easeOut",
                  }}
                  className="w-full max-w-[16.5rem]"
                >
                  <PhoneMockup
                    src={imageUrl}
                    alt={image.alt || `${projectTitle} app screen ${index + 1}`}
                    caption={caption(image.alt, `Screen ${index + 1}`)}
                    sizes="(min-width: 1024px) 220px, 45vw"
                    className="max-w-none"
                  />
                </motion.div>
              );
            })}
          </div>
        ) : null}

        {webScreens.length > 0 ? (
          <div className="mt-20">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
              Web Platform
            </p>
            <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
              Dashboard, analytics and home
            </h3>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {webScreens
                .filter((item) => item.label !== "Home")
                .map((item, index) => {
                  const imageUrl = getImageUrl(item.image, 1800);
                  if (!imageUrl) return null;

                  return (
                    <motion.div
                      key={item.image.asset._ref || item.label}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{
                        duration: 0.45,
                        delay: index * 0.08,
                        ease: "easeOut",
                      }}
                    >
                      <ProductFrame
                        src={imageUrl}
                        alt={item.image.alt || `${projectTitle} ${item.label}`}
                        caption={item.label}
                        aspectClass="aspect-[16/9]"
                        sizes="(min-width: 1024px) 42vw, 100vw"
                      />
                    </motion.div>
                  );
                })}
            </div>

            {webScreens
              .filter((item) => item.label === "Home")
              .map((item) => {
                const imageUrl = getImageUrl(item.image, 1400);
                if (!imageUrl) return null;

                return (
                  <motion.div
                    key={item.image.asset._ref}
                    className="mx-auto mt-12 w-full max-w-[22rem]"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  >
                    <ProductFrame
                      src={imageUrl}
                      alt={item.image.alt || `${projectTitle} home`}
                      caption={item.label}
                      aspectClass="aspect-[9/16]"
                      sizes="(min-width: 1024px) 360px, 80vw"
                    />
                  </motion.div>
                );
              })}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
