import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/client";
import {
  allProjectsQuery,
  featuredProjectsQuery,
  projectBySlugQuery,
} from "@/sanity/lib/queries";
import type { CaseStudyProject, FeaturedProject } from "@/types/sanity";

export async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  try {
    const projects = await sanityFetch<FeaturedProject[]>(featuredProjectsQuery);

    return projects ?? [];
  } catch {
    return [];
  }
}

export async function getAllProjects(): Promise<FeaturedProject[]> {
  try {
    const projects = await sanityFetch<FeaturedProject[]>(allProjectsQuery);

    return projects ?? [];
  } catch {
    return [];
  }
}

export const getProjectBySlug = cache(
  async (slug: string): Promise<CaseStudyProject | null> => {
    try {
      const project = await sanityFetch<CaseStudyProject | null>(
        projectBySlugQuery,
        { slug },
      );

      return project ?? null;
    } catch {
      return null;
    }
  },
);
