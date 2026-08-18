import { sanityFetch } from "@/sanity/lib/client";
import { allServicesQuery, homepageServicesQuery } from "@/sanity/lib/queries";
import type { HomepageService, ServicesPageService } from "@/types/sanity";

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
