import type { MetadataRoute } from "next";

import { getSitemapEntries } from "@/sanity/lib/sitemap";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

function page(
  path: string,
  lastModified?: string | Date,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly",
  priority = 0.8,
): MetadataRoute.Sitemap[number] {
  return {
    url: `${getSiteUrl()}${path}`,
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects, services, blogs } = await getSitemapEntries();

  const staticPages: MetadataRoute.Sitemap = [
    page("/", undefined, "weekly", 1),
    page("/about", undefined, "monthly", 0.7),
    page("/portfolio", undefined, "weekly", 0.9),
    page("/services", undefined, "weekly", 0.9),
    page("/blogs", undefined, "weekly", 0.8),
    page("/contact", undefined, "monthly", 0.6),
  ];

  const projectPages = projects
    .filter((item) => item.slug)
    .map((item) =>
      page(`/portfolio/${item.slug}`, item._updatedAt, "monthly", 0.7),
    );

  const servicePages = services
    .filter((item) => item.slug)
    .map((item) =>
      page(`/services/${item.slug}`, item._updatedAt, "monthly", 0.7),
    );

  const blogPages = blogs
    .filter((item) => item.slug)
    .map((item) =>
      page(
        `/blogs/${item.slug}`,
        item.publishedAt || item._updatedAt,
        "monthly",
        0.6,
      ),
    );

  return [...staticPages, ...projectPages, ...servicePages, ...blogPages];
}
