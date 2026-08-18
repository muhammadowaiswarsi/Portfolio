import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/client";
import { allBlogsQuery, blogBySlugQuery } from "@/sanity/lib/queries";
import type { BlogArticle, BlogListItem } from "@/types/sanity";

export async function getAllBlogs(): Promise<BlogListItem[]> {
  try {
    const posts = await sanityFetch<BlogListItem[]>(allBlogsQuery);

    return posts ?? [];
  } catch {
    return [];
  }
}

export const getBlogBySlug = cache(
  async (slug: string): Promise<BlogArticle | null> => {
    try {
      const post = await sanityFetch<BlogArticle | null>(blogBySlugQuery, {
        slug,
      });

      return post ?? null;
    } catch {
      return null;
    }
  },
);
