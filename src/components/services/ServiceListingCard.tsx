"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { urlFor } from "@/sanity/lib/image";
import type { ServicesPageService } from "@/types/sanity";

const panels = [
  "bg-primary",
  "bg-[color-mix(in_srgb,var(--primary)_88%,black)]",
  "bg-[color-mix(in_srgb,var(--primary)_78%,var(--accent))]",
  "bg-[color-mix(in_srgb,var(--primary)_92%,white)]",
  "bg-[color-mix(in_srgb,var(--primary)_70%,black)]",
] as const;

type ServiceListingCardProps = {
  service: ServicesPageService;
  index: number;
};

export function ServiceListingCard({
  service,
  index,
}: ServiceListingCardProps) {
  const href = `/services/${service.slug}`;
  const reverse = index % 2 === 1;
  const features = (service.features ?? []).filter(
    (item) =>
      typeof item.title === "string" &&
      item.title.trim().length > 0 &&
      typeof item.description === "string" &&
      item.description.trim().length > 0,
  ).slice(0, 4);
  const iconUrl = service.icon?.asset
    ? urlFor(service.icon).width(240).height(240).fit("crop").url()
    : null;
  const visualAlt = service.icon?.alt || service.title;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
    >
      <div
        className={cn(
          "relative mx-auto aspect-square w-full max-w-[34rem] overflow-hidden rounded-[2rem]",
          panels[index % panels.length],
          reverse && "lg:order-2",
        )}
      >
        <span
          aria-hidden="true"
          className="absolute top-8 left-8 size-24 rounded-3xl bg-white/10"
        />
        <span
          aria-hidden="true"
          className="absolute right-10 bottom-16 size-16 rounded-full border border-white/20"
        />
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/3 size-10 rounded-xl bg-accent/80"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-6 top-4 font-display text-7xl font-semibold tracking-[-0.08em] text-white/15"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-28 items-center justify-center rounded-[1.75rem] border border-white/20 bg-background/20 backdrop-blur-sm sm:size-32">
            {iconUrl ? (
              <Image
                src={iconUrl}
                alt={visualAlt}
                width={96}
                height={96}
                className="size-16 object-contain sm:size-20"
              />
            ) : (
              <span className="size-10 rounded-lg bg-accent" />
            )}
          </div>
        </div>
      </div>

      <div className={cn(reverse && "lg:order-1")}>
        <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-[2.75rem]">
          {service.title}
        </h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
          {service.shortDescription}
        </p>

        {features.length > 0 ? (
          <ul className="mt-7 space-y-4">
            {features.map((feature) => (
              <li
                key={feature._key || feature.title}
                className="text-sm leading-6 text-muted sm:text-[15px] sm:leading-7"
              >
                <span className="font-semibold text-accent">
                  {feature.title}:
                </span>{" "}
                {feature.description}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-8">
          <Button href={href} className="rounded-full px-6">
            Explore Service
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
