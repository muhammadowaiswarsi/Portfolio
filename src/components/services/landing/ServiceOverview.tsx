"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { ProjectPortableText } from "@/components/portfolio/ProjectPortableText";
import {
  fadeUp,
  getImageUrl,
  hasImage,
  hasItems,
  hasPortableText,
} from "@/components/services/landing/helpers";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SanityImage, ServiceLanding } from "@/types/sanity";

type ServiceOverviewProps = {
  service: ServiceLanding;
};

function overviewImage(service: ServiceLanding): SanityImage | null {
  if (hasImage(service.heroImage) && service.heroImage) {
    return service.heroImage;
  }

  if (hasItems(service.gallery)) {
    const galleryImage = service.gallery.find((image) => hasImage(image));
    if (galleryImage) return galleryImage;
  }

  return null;
}

export function ServiceOverview({ service }: ServiceOverviewProps) {
  const content = hasPortableText(service.overview)
    ? service.overview
    : hasPortableText(service.description)
      ? service.description
      : null;

  if (!content) return null;

  const image = overviewImage(service);
  const imageUrl = image ? getImageUrl(image, 1400, 1400) : null;
  const iconUrl = hasImage(service.icon)
    ? getImageUrl(service.icon, 240, 240)
    : null;
  const imageAlt = image?.alt || `${service.title} overview`;

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            className="relative mx-auto aspect-square w-full max-w-[34rem] overflow-hidden rounded-[2rem] bg-primary"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span
              aria-hidden="true"
              className="absolute top-8 left-8 size-24 rounded-3xl bg-white/10"
            />
            <span
              aria-hidden="true"
              className="absolute right-10 bottom-16 size-16 rounded-full border border-white/20"
            />

            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 34rem, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex size-28 items-center justify-center rounded-[1.75rem] border border-white/20 bg-background/20 backdrop-blur-sm sm:size-32">
                  {iconUrl ? (
                    <Image
                      src={iconUrl}
                      alt={imageAlt}
                      width={96}
                      height={96}
                      className="size-16 object-contain sm:size-20"
                    />
                  ) : (
                    <span className="size-10 rounded-lg bg-accent" />
                  )}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0.08}
            variants={fadeUp}
          >
            <SectionHeading
              title="Overview"
              headingClassName="font-display font-semibold"
            />
            <div className="mt-8 border-l-2 border-accent/80 pl-6 sm:pl-8">
              <ProjectPortableText value={content} />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
