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

function isStaffAugmentation(service: { slug?: string | null }) {
  return service.slug === STAFF_AUGMENTATION_SLUG;
}

/** Keep CMS order, with Staff Augmentation first and AI Solutions second. */
function pinFeaturedServices<T extends { title?: string | null; slug?: string | null }>(
  services: T[],
) {
  const rank = (service: T) => {
    if (isStaffAugmentation(service)) return 0;
    if (isAiSolutions(service)) return 1;
    return 2;
  };

  return [...services].sort((a, b) => rank(a) - rank(b));
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

    return pinFeaturedServices(
      withStaffAugmentation(services ?? [], staffAugmentationHomepage),
    );
  } catch {
    return [];
  }
}

export async function getAllServices(): Promise<ServicesPageService[]> {
  try {
    const services = await sanityFetch<ServicesPageService[]>(allServicesQuery);

    return pinFeaturedServices(
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
