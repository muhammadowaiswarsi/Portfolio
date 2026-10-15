import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/client";
import {
  allServicesQuery,
  homepageServicesQuery,
  serviceBySlugQuery,
} from "@/sanity/lib/queries";
import type {
  HomepageService,
  ServiceLanding,
  ServicesPageService,
} from "@/types/sanity";

function isAiSolutions(service: { title?: string | null; slug?: string | null }) {
  const title = service.title?.toLowerCase() ?? "";
  const slug = service.slug?.toLowerCase() ?? "";
  return (
    slug === "ai-solutions" ||
    slug.startsWith("ai-") ||
    title.includes("ai solution") ||
    /\bai\b/.test(title)
  );
}

/** Keep CMS order, but always show AI Solutions first. */
function pinAiSolutionsFirst<T extends { title?: string | null; slug?: string | null }>(
  services: T[],
) {
  return [...services].sort((a, b) => Number(isAiSolutions(b)) - Number(isAiSolutions(a)));
}

export async function getHomepageServices(): Promise<HomepageService[]> {
  try {
    const services = await sanityFetch<HomepageService[]>(homepageServicesQuery);

    return pinAiSolutionsFirst(services ?? []);
  } catch {
    return [];
  }
}

export async function getAllServices(): Promise<ServicesPageService[]> {
  try {
    const services = await sanityFetch<ServicesPageService[]>(allServicesQuery);

    return pinAiSolutionsFirst(services ?? []);
  } catch {
    return [];
  }
}

export const getServiceBySlug = cache(
  async (slug: string): Promise<ServiceLanding | null> => {
    try {
      const service = await sanityFetch<ServiceLanding | null>(
        serviceBySlugQuery,
        { slug },
      );

      return service ?? null;
    } catch {
      return null;
    }
  },
);
