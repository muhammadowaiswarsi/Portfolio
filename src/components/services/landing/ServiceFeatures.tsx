"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import {
  completeFeatures,
  getImageUrl,
  hasImage,
} from "@/components/services/landing/helpers";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import type { ServiceLanding } from "@/types/sanity";

type ServiceFeaturesProps = {
  service: ServiceLanding;
};

export function ServiceFeatures({ service }: ServiceFeaturesProps) {
  const features = completeFeatures(service.features);

  if (features.length === 0) return null;

  const hasAnyImage = features.some((feature) => hasImage(feature.image));

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="FEATURES"
          title="What We Deliver"
          headingClassName="font-display font-semibold"
        />

        {hasAnyImage ? (
          <div className="mt-12 space-y-10 lg:space-y-16">
            {features.map((feature, index) => {
              const imageUrl = hasImage(feature.image)
                ? getImageUrl(feature.image, 1400, 900)
                : null;
              const imageAlt = feature.image?.alt || feature.title || "Feature";
              const reverse = index % 2 === 1;

              return (
                <motion.article
                  key={feature._key || `${feature.title}-${index}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="grid items-center gap-8 overflow-hidden rounded-2xl border border-border bg-surface lg:grid-cols-2 lg:gap-12"
                >
                  {imageUrl ? (
                    <div
                      className={cn(
                        "relative aspect-[16/10] overflow-hidden bg-primary/20",
                        reverse && "lg:order-2",
                      )}
                    >
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}
                  <div className={cn("p-6 sm:p-8 lg:p-10", reverse && "lg:order-1")}>
                    <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
                      {feature.title}
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-muted sm:text-base sm:leading-7">
                      {feature.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
            {features.map((feature, index) => (
              <motion.article
                key={feature._key || `${feature.title}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index, 6) * 0.06,
                  ease: "easeOut",
                }}
                className="rounded-2xl border border-border bg-surface p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary sm:p-8"
              >
                <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
                  {feature.description}
                </p>
              </motion.article>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
