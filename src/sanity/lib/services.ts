import { cache } from "react";

import {
  STAFF_AUGMENTATION_SLUG,
  staffAugmentationHomepage,
  staffAugmentationLanding,
  staffAugmentationListing,
} from "@/sanity/content/staffAugmentation";
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

function withStaffAugmentation<T extends { slug?: string | null }>(
  services: T[],
  entry: T,
) {
  if (services.some((service) => service.slug === STAFF_AUGMENTATION_SLUG)) {
    return services;
  }

  return [...services, entry];
}

export async function getHomepageServices(): Promise<HomepageService[]> {
  try {
    const services = await sanityFetch<HomepageService[]>(homepageServicesQuery);

    return pinAiSolutionsFirst(
      withStaffAugmentation(services ?? [], staffAugmentationHomepage),
    );
  } catch {
    return [];
  }
}

export async function getAllServices(): Promise<ServicesPageService[]> {
  try {
    const services = await sanityFetch<ServicesPageService[]>(allServicesQuery);

    return pinAiSolutionsFirst(
      withStaffAugmentation(services ?? [], staffAugmentationListing),
    );
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

      if (service) return service;
    } catch {
      // Fall through to the local Staff Augmentation document when Sanity is unavailable.
    }

    return slug === STAFF_AUGMENTATION_SLUG ? staffAugmentationLanding : null;
  },
);
