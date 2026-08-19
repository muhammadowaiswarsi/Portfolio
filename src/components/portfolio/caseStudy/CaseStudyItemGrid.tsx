"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import {
  caseStudySubheadClass,
  completeCaseStudyItems,
  getImageUrl,
} from "@/components/portfolio/caseStudy/helpers";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { CaseStudyItem } from "@/types/sanity";

type CaseStudyItemGridProps = {
  eyebrow: string;
  title: string;
  items: CaseStudyItem[] | null | undefined;
  numbered?: boolean;
  imageFit?: "cover" | "contain";
};

export function CaseStudyItemGrid({
  eyebrow,
  title,
  items,
  numbered = false,
  imageFit = "cover",
}: CaseStudyItemGridProps) {
  const completeItems = completeCaseStudyItems(items);

  if (completeItems.length === 0) return null;

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          headingClassName="font-display font-semibold"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {completeItems.map((item, index) => {
            const imageUrl =
              imageFit === "contain"
                ? getImageUrl(item.image, 1200)
                : getImageUrl(item.image, 1200, 750);
            const imageAlt = item.image?.alt || item.title || title;

            return (
              <motion.article
                key={item._key || `${item.title}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.06,
                  ease: "easeOut",
                }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface"
              >
                {imageUrl ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                      className={
                        imageFit === "contain"
                          ? "object-contain"
                          : "object-cover"
                      }
                    />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  {numbered ? (
                    <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                  ) : null}
                  <h3 className={`text-xl sm:text-2xl ${caseStudySubheadClass}`}>
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
