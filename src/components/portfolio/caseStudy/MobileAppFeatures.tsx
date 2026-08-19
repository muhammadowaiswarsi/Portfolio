"use client";

import { motion } from "framer-motion";

import { PhoneMockup } from "@/components/portfolio/caseStudy/PhoneMockup";
import { ProductFrame } from "@/components/portfolio/caseStudy/ProductFrame";
import {
  caseStudySubheadClass,
  completeCaseStudyItems,
  fadeUp,
  getImageUrl,
  hasImage,
  isPhoneScreen,
} from "@/components/portfolio/caseStudy/helpers";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import type { CaseStudyItem } from "@/types/sanity";

type MobileAppFeaturesProps = {
  items?: CaseStudyItem[] | null;
};

export function MobileAppFeatures({ items }: MobileAppFeaturesProps) {
  const completeItems = completeCaseStudyItems(items);
  const withImages = completeItems.filter((item) => hasImage(item.image));
  const preferred = withImages.filter((item) =>
    /dashboard|analytics|paylinkz url/i.test(item.title || ""),
  );
  const featured = (preferred.length >= 3 ? preferred : withImages).slice(0, 3);
  const remaining = completeItems.filter(
    (item) => !featured.some((feature) => feature._key === item._key),
  );

  if (featured.length === 0 && remaining.length === 0) return null;

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Highlights"
          title="Key Features"
          headingClassName="font-display font-semibold"
        />

        {featured.length > 0 ? (
          <div className="mt-14 space-y-16 lg:space-y-24">
            {featured.map((item, index) => {
              const imageUrl = getImageUrl(item.image, 1400);
              const imageAlt = item.image?.alt || item.title || "Feature";
              const phone = isPhoneScreen(item.image);
              const imageOnRight = index % 2 === 0;

              return (
                <motion.article
                  key={item._key || `${item.title}-${index}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={0.06}
                  variants={fadeUp}
                  className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
                >
                  <div className={imageOnRight ? "lg:order-1" : "lg:order-2"}>
                    <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className={`text-2xl sm:text-3xl ${caseStudySubheadClass}`}>
                      {item.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
                      {item.description}
                    </p>
                  </div>

                  <div
                    className={cn(
                      imageOnRight ? "lg:order-2" : "lg:order-1",
                      phone ? "mx-auto w-full max-w-[17rem]" : "min-w-0",
                    )}
                  >
                    {imageUrl ? (
                      phone ? (
                        <PhoneMockup
                          src={imageUrl}
                          alt={imageAlt}
                          sizes="(min-width: 1024px) 280px, 70vw"
                          className="max-w-none"
                        />
                      ) : (
                        <ProductFrame
                          src={imageUrl}
                          alt={imageAlt}
                          aspectClass="aspect-[16/10]"
                          sizes="(min-width: 1024px) 42vw, 100vw"
                        />
                      )
                    ) : null}
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : null}

        {remaining.length > 0 ? (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {remaining.map((item, index) => (
              <article
                key={item._key || `${item.title}-rest-${index}`}
                className="rounded-2xl border border-border bg-surface p-6 sm:p-7"
              >
                <h3 className={`text-xl ${caseStudySubheadClass}`}>{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
