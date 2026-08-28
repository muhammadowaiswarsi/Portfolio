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

    return {
      projects: entries?.projects ?? [],
      services: entries?.services ?? [],
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
