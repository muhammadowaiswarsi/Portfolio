import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { urlFor } from "@/sanity/lib/image";
import type { HomepageService } from "@/types/sanity";

type ServiceCardProps = {
  service: HomepageService;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const iconUrl = service.icon?.asset
    ? urlFor(service.icon).width(160).height(160).fit("crop").url()
    : null;
  const iconAlt = service.icon?.alt || service.title;
  const href = `/services/${service.slug}`;

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_24px_60px_color-mix(in_srgb,var(--primary)_22%,transparent)] sm:p-7">
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

      <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
        <Link href={href} className="transition-colors hover:text-accent">
          {service.title}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
        {service.shortDescription}
      </p>

      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
      >
        View Details
        <ArrowUpRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}
