import { STAFF_AUGMENTATION_SLUG } from "@/sanity/content/staffAugmentation";
import { sanityFetch } from "@/sanity/lib/client";
import { sitemapEntriesQuery } from "@/sanity/lib/queries";

export type SitemapEntry = {
  slug: string;
  _updatedAt?: string;
  publishedAt?: string;
};

export type SitemapEntries = {
  projects: SitemapEntry[];
  services: SitemapEntry[];
  blogs: SitemapEntry[];
};

export async function getSitemapEntries(): Promise<SitemapEntries> {
  try {
    const entries = await sanityFetch<SitemapEntries>(sitemapEntriesQuery);

    const services = entries?.services ?? [];

    return {
      projects: entries?.projects ?? [],
      services: services.some((item) => item.slug === STAFF_AUGMENTATION_SLUG)
        ? services
        : [...services, { slug: STAFF_AUGMENTATION_SLUG }],
      blogs: entries?.blogs ?? [],
    };
  } catch {
    return {
      projects: [],
      services: [],
      blogs: [],
    };
  }
}
