import { sanityFetch } from "@/sanity/lib/client";
import { ragIndexingCatalogQuery } from "@/lib/rag/indexing/queries";

export type SanityTextPair = {
  title?: string | null;
  description?: string | null;
  question?: string | null;
  answer?: string | null;
};

export type SanityIndexingService = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  shortDescription?: string | null;
  heroDescription?: string | null;
  overview?: string | null;
  technologies?: string[] | null;
  features?: SanityTextPair[] | null;
  faqs?: SanityTextPair[] | null;
  process?: SanityTextPair[] | null;
  benefits?: SanityTextPair[] | null;
};

export type SanityIndexingProject = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  shortDescription?: string | null;
  overview?: string | null;
  industry?: string | null;
  projectType?: string | null;
  technologies?: string[] | null;
  servicesProvided?: string[] | null;
  projectGoals?: SanityTextPair[] | null;
  challenges?: SanityTextPair[] | null;
  approach?: SanityTextPair[] | null;
  keyFeatures?: SanityTextPair[] | null;
  results?: SanityTextPair[] | null;
};

export type SanityIndexingBlog = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  body?: string | null;
  publishedAt?: string | null;
};

export type SanityIndexingTestimonial = {
  _id: string;
  name?: string | null;
  role?: string | null;
  company?: string | null;
  content?: string | null;
};

export type SanityIndexingCatalog = {
  services?: SanityIndexingService[] | null;
  projects?: SanityIndexingProject[] | null;
  blogs?: SanityIndexingBlog[] | null;
  testimonials?: SanityIndexingTestimonial[] | null;
};

export async function fetchSanityIndexingCatalog(): Promise<SanityIndexingCatalog> {
  const catalog = await sanityFetch<SanityIndexingCatalog>(
    ragIndexingCatalogQuery,
  );
  return catalog ?? {};
}
