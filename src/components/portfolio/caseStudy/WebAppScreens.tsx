"use client";

import { motion } from "framer-motion";

import { LaptopMockup } from "@/components/portfolio/caseStudy/LaptopMockup";
import { PhoneMockup } from "@/components/portfolio/caseStudy/PhoneMockup";
import { ShowcaseFrame } from "@/components/portfolio/caseStudy/ShowcaseFrame";
import {
  getImageUrl,
  hasImage,
  hasItems,
  isGraphicShowcase,
  isWebScreen,
} from "@/components/portfolio/caseStudy/helpers";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SanityImage } from "@/types/sanity";

type WebAppScreensProps = {
  images?: SanityImage[] | null;
  projectTitle: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  mobileEyebrow?: string;
  mobileTitle?: string;
  mobileDescription?: string;
};

type ScreenKind = "mobile" | "graphic" | "desktop";

function caption(alt: string | undefined, fallback: string) {
  if (!alt) return fallback;
  const parts = alt.split(/[—–]/).map((part) => part.trim());
  return parts.slice(1).join(" — ") || parts[0] || fallback;
}

function isMobileShot(image: SanityImage) {
  return /^mobile\b/i.test(image.alt || "");
}

function screenKind(image: SanityImage): ScreenKind {
  if (isMobileShot(image)) return "mobile";
  if (isGraphicShowcase(image)) return "graphic";
  return "desktop";
}

function clusterScreens(images: SanityImage[]) {
  const groups: { kind: ScreenKind; images: SanityImage[] }[] = [];

  for (const image of images) {
    const kind = screenKind(image);
    const last = groups[groups.length - 1];

    if (last && last.kind === kind) {
      last.images.push(image);
      continue;
    }

    groups.push({ kind, images: [image] });
  }

  return groups;
}

export function WebAppScreens({
  images,
  projectTitle,
  eyebrow = "Product Screens",
  title = "Inside the platform",
  description = "Key workflows from the web application, shown at desktop scale so the product interface stays readable.",
  mobileEyebrow = "Responsive",
  mobileTitle = "Built for smaller screens",
  mobileDescription = "The same product on mobile, shown in phone frames so the responsive layout stays clear.",
}: WebAppScreensProps) {
  const gallery = (hasItems(images) ? images : []).filter(hasImage);
  const groups = clusterScreens(gallery);
  const hasMain = groups.some((group) => group.kind !== "mobile");
  const hasMobile = groups.some((group) => group.kind === "mobile");

  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        {hasMain ? (
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            headingClassName="font-display font-semibold"
          />
        ) : (
          <SectionHeading
            eyebrow={mobileEyebrow}
            title={mobileTitle}
            description={mobileDescription}
            headingClassName="font-display font-semibold"
          />
        )}

        <div className={hasMain || hasMobile ? "mt-14 space-y-16 lg:space-y-20" : ""}>
          {groups.map((group, groupIndex) => {
            if (group.kind === "mobile") {
              return (
                <div
                  key={`mobile-${groupIndex}`}
                  className={
                    hasMain && groupIndex > 0
                      ? "border-t border-border pt-16 sm:pt-20"
                      : ""
                  }
                >
                  {hasMain ? (
                    <SectionHeading
                      eyebrow={mobileEyebrow}
                      title={mobileTitle}
                      description={mobileDescription}
                      headingClassName="font-display font-semibold"
                    />
                  ) : null}
                  <div
                    className={`${hasMain ? "mt-14 " : ""}grid justify-items-center gap-10 sm:grid-cols-2 lg:grid-cols-3`}
                  >
                    {group.images.map((image, index) => {
                      const imageUrl = getImageUrl(image, 1200);
                      if (!imageUrl) return null;

                      return (
                        <motion.div
                          key={image.asset._ref || `mobile-${groupIndex}-${index}`}
                          className="w-full max-w-[18rem]"
                          initial={{ opacity: 0, y: 24 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{
                            duration: 0.45,
                            delay: index * 0.06,
                            ease: "easeOut",
                          }}
                        >
                          <PhoneMockup
                            src={imageUrl}
                            alt={
                              image.alt ||
                              `${projectTitle} mobile screen ${index + 1}`
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
              );
            }

            if (group.kind === "graphic") {
              return (
                <div
                  key={`graphic-${groupIndex}`}
                  className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12"
                >
                  {group.images.map((image, index) => {
                    const imageUrl = getImageUrl(image, 1000);
                    if (!imageUrl) return null;
                    const tall = /^portrait\b/i.test(image.alt || "");

                    return (
                      <motion.figure
                        key={image.asset._ref || `graphic-${groupIndex}-${index}`}
                        className={tall ? "min-w-0" : "min-w-0 lg:col-span-2"}
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.12 }}
                        transition={{ duration: 0.5, delay: 0.04, ease: "easeOut" }}
                      >
                        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
                          {caption(image.alt, `Screen ${index + 1}`)}
                        </p>
                        <ShowcaseFrame
                          src={imageUrl}
                          alt={
                            image.alt ||
                            `${projectTitle} platform screen ${index + 1}`
                          }
                          layout={tall ? "tall" : "wide"}
                          sizes={
                            tall
                              ? "(min-width: 1024px) 420px, 90vw"
                              : "(min-width: 1280px) 1100px, 100vw"
                          }
                        />
                      </motion.figure>
                    );
                  })}
                </div>
              );
            }

            return (
              <div key={`desktop-${groupIndex}`} className="space-y-16 lg:space-y-20">
                {group.images.map((image, index) => {
                  const imageUrl = getImageUrl(image, 1800);
                  if (!imageUrl) return null;

                  return (
                    <motion.figure
                      key={image.asset._ref || `desktop-${groupIndex}-${index}`}
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
                          image.alt ||
                          `${projectTitle} platform screen ${index + 1}`
                        }
                        fit="contain"
                        aspectClass={
                          isWebScreen(image) ? "aspect-[21/10]" : "aspect-[3/2]"
                        }
                        sizes="(min-width: 1280px) 1100px, 100vw"
                      />
                    </motion.figure>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
