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

export async function getHomepageServices(): Promise<HomepageService[]> {
  try {
    const services = await sanityFetch<HomepageService[]>(homepageServicesQuery);

    return services ?? [];
  } catch {
    return [];
  }
}

export async function getAllServices(): Promise<ServicesPageService[]> {
  try {
    const services = await sanityFetch<ServicesPageService[]>(allServicesQuery);

    return services ?? [];
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
