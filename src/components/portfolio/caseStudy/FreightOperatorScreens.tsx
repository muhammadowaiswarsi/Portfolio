"use client";

import { motion } from "framer-motion";

import { ShowcaseFrame } from "@/components/portfolio/caseStudy/ShowcaseFrame";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const screens = [
  {
    src: "/portfolio/freight-operator/live-tracking.jpg",
    alt: "FreightOperator live tracking map with drivers, an active route from Seattle to Tacoma, and driver details",
    caption: "Live tracking",
  },
  {
    src: "/portfolio/freight-operator/trip-progress.jpg",
    alt: "FreightOperator trip progress with a cross-country route, ETA, remaining miles, and current speed",
    caption: "Trip progress",
  },
  {
    src: "/portfolio/freight-operator/dispatch.jpg",
    alt: "FreightOperator dispatch board with container counts, alerts, and load status",
    caption: "Dispatch board",
  },
  {
    src: "/portfolio/freight-operator/messages.jpg",
    alt: "FreightOperator load messaging with driver conversations tied to each load",
    caption: "Load messaging",
  },
  {
    src: "/portfolio/freight-operator/payments.jpg",
    alt: "FreightOperator payments screen with invoiced, partially paid, and paid totals",
    caption: "Payments",
  },
  {
    src: "/portfolio/freight-operator/driver-pay.jpg",
    alt: "FreightOperator driver pay board with settlement totals and load-level pay status",
    caption: "Driver settlements",
  },
];

export function FreightOperatorScreens() {
  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Product Screens"
          title="Inside the platform"
          description="Live tracking, dispatch, messaging, and billing from FreightOperator, shown so the working interface stays readable."
          headingClassName="font-display font-semibold"
        />
        <div className="mt-14 space-y-16 lg:space-y-20">
          {screens.map((screen, index) => (
            <motion.figure
              key={screen.src}
              className="min-w-0"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.04, ease: "easeOut" }}
            >
              <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
                {screen.caption}
              </p>
              <ShowcaseFrame
                src={screen.src}
                alt={screen.alt}
                priority={index === 0}
                sizes="(min-width: 1280px) 1100px, 100vw"
              />
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
