import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/client";
import {
  allProjectsQuery,
  featuredProjectsQuery,
  projectBySlugQuery,
} from "@/sanity/lib/queries";
import type { CaseStudyProject, FeaturedProject } from "@/types/sanity";

const PORTFOLIO_ORDER = [
  "tms-system",
  "paylinkz",
  "arabian-metal-industries-ami",
  "traino-ai",
  "study-panda",
  "purchase-tracker-360",
  "share-accountz",
  "laetus-store",
  "health-share",
  "machwerk",
  "askademia",
] as const;

function sortPortfolioProjects<T extends { slug: string }>(projects: T[]) {
  const rank = new Map<string, number>(
    PORTFOLIO_ORDER.map((slug, index) => [slug, index]),
  );

  return [...projects].sort((a, b) => {
    const aRank = rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
    const bRank = rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER;

    if (aRank !== bRank) return aRank - bRank;
    return a.slug.localeCompare(b.slug);
  });
}

export async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  try {
    const projects = await sanityFetch<FeaturedProject[]>(featuredProjectsQuery);

    return sortPortfolioProjects(projects ?? []);
  } catch {
    return [];
  }
}

export async function getAllProjects(): Promise<FeaturedProject[]> {
  try {
    const projects = await sanityFetch<FeaturedProject[]>(allProjectsQuery);

    return sortPortfolioProjects(projects ?? []);
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
