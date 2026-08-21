"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import {
  getImageUrl,
  hasImage,
  hasItems,
} from "@/components/services/landing/helpers";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import type { ServiceLanding } from "@/types/sanity";

type ServiceGalleryProps = {
  service: ServiceLanding;
};

export function ServiceGallery({ service }: ServiceGalleryProps) {
  const gallery = (hasItems(service.gallery) ? service.gallery : []).filter(
    hasImage,
  );

  if (gallery.length === 0) return null;

  const gridClass =
    gallery.length === 1
      ? "mx-auto max-w-4xl"
      : gallery.length === 2
        ? "grid gap-5 sm:grid-cols-2 lg:gap-6"
        : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6";

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="GALLERY"
          title="Gallery"
          headingClassName="font-display font-semibold"
        />

        <div className={cn("mt-12", gridClass)}>
          {gallery.map((image, index) => {
            const imageUrl = getImageUrl(image, 1600, 1100);
            if (!imageUrl) return null;

            return (
              <motion.figure
                key={image.asset._ref || index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index, 6) * 0.06,
                  ease: "easeOut",
                }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={imageUrl}
                    alt={
                      image.alt || `${service.title} gallery image ${index + 1}`
                    }
                    fill
                    sizes={
                      gallery.length === 1
                        ? "(min-width: 1280px) 896px, 100vw"
                        : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    }
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
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
