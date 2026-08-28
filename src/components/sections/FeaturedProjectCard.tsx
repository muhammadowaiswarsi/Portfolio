import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { urlFor } from "@/sanity/lib/image";
import type { FeaturedProject } from "@/types/sanity";

type FeaturedProjectCardProps = {
  project: FeaturedProject;
};

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
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
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface">
      <Link href={href} className="relative block overflow-hidden bg-primary">
        <div className="relative aspect-[5/4]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
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

        <h3 className="font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
          <Link href={href} className="transition-colors hover:text-accent">
            {project.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-3 max-w-sm text-sm leading-6 text-muted">
          {project.shortDescription}
        </p>

        <div className="mt-auto pt-8">
          <Button
            href={href}
            variant="secondary"
            size="sm"
            className="rounded-full border-border px-6 leading-none hover:border-accent hover:bg-transparent hover:text-accent"
          >
            View Case Study
          </Button>
        </div>
      </div>
    </article>
  );
}
