"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { urlFor } from "@/sanity/lib/image";
import type { FeaturedProject } from "@/types/sanity";

type FeaturedProjectCardProps = {
  project: FeaturedProject;
  index: number;
};

export function FeaturedProjectCard({
  project,
  index,
}: FeaturedProjectCardProps) {
  const cardSource = project.cardImage?.asset
    ? project.cardImage
    : project.thumbnail;
  const imageUrl = cardSource?.asset
    ? urlFor(cardSource).width(1400).height(1120).fit("crop").url()
    : null;
  const imageAlt = cardSource?.alt || project.title;
  const href = `/portfolio/${project.slug}`;
  const category =
    typeof project.category === "string" && project.category.trim()
      ? project.category
      : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface"
    >
      <Link href={href} className="relative block overflow-hidden bg-[#2C5270]">
        <div className="relative aspect-[5/4]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              unoptimized
            />
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col items-center px-7 py-8 text-center sm:px-8 sm:py-10">
        {category ? (
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
            {category}
          </p>
        ) : null}

        <h3 className="text-[1.35rem] font-semibold tracking-tight text-white sm:text-2xl">
          <Link href={href} className="transition-colors hover:text-accent">
            {project.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-3 max-w-sm text-sm leading-6 text-muted">
          {project.shortDescription}
        </p>

        <Button
          href={href}
          variant="secondary"
          size="sm"
          className="mt-8 rounded-full border-white/25 px-6 hover:border-accent hover:bg-transparent hover:text-accent"
        >
          View Case Study
        </Button>
      </div>
    </motion.article>
  );
}
