"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { ProjectPortableText } from "@/components/portfolio/ProjectPortableText";
import { Button } from "@/components/ui/Button";
import { urlFor } from "@/sanity/lib/image";
import type { ServicesPageService } from "@/types/sanity";

type ServiceListingCardProps = {
  service: ServicesPageService;
  index: number;
};

export function ServiceListingCard({
  service,
  index,
}: ServiceListingCardProps) {
  const iconUrl = service.icon?.asset
    ? urlFor(service.icon).width(160).height(160).fit("crop").url()
    : null;
  const iconAlt = service.icon?.alt || service.title;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index, 5) * 0.08,
        ease: "easeOut",
      }}
      className="group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary sm:p-8"
    >
      <span className="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />

      <div className="mb-6 flex size-14 items-center justify-center overflow-hidden rounded-xl border border-primary/40 bg-primary/20 transition-colors duration-300 group-hover:border-accent/50 group-hover:bg-accent/10">
        {iconUrl ? (
          <Image
            src={iconUrl}
            alt={iconAlt}
            width={40}
            height={40}
            className="size-10 object-contain"
          />
        ) : (
          <span className="size-5 rounded-sm bg-primary transition-colors duration-300 group-hover:bg-accent" />
        )}
      </div>

      <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-white sm:text-[1.75rem]">
        {service.title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-white/80 sm:text-[15px] sm:leading-7">
        {service.shortDescription}
      </p>

      {service.description?.length ? (
        <div className="mt-5 flex-1 [&_h2]:text-lg [&_h3]:text-base [&_p]:text-sm [&_p]:leading-6 [&_p]:sm:text-[15px] [&_p]:sm:leading-7">
          <ProjectPortableText value={service.description} />
        </div>
      ) : null}

      <div className="mt-8">
        <Button href="/contact" size="sm">
          Let&apos;s Talk
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </motion.article>
  );
}
