import { groq } from "next-sanity";

/**
 * Compact text-only catalog for RAG indexing.
 * Uses existing Sanity types; no image/asset fields.
 */
export const ragIndexingCatalogQuery = groq`{
  "services": *[_type == "service" && defined(slug.current)] | order(coalesce(order, 9999) asc, _createdAt asc) [0...50] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    heroDescription,
    technologies,
    "overview": pt::text(overview),
    features[] { title, description },
    faqs[] { question, answer },
    process[] { title, description },
    benefits[] { title, description }
  },
  "projects": *[_type == "project" && defined(slug.current)] | order(_updatedAt desc) [0...50] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    industry,
    projectType,
    technologies,
    servicesProvided,
    "overview": pt::text(description),
    projectGoals[] { title, description },
    challenges[] { title, description },
    approach[] { title, description },
    keyFeatures[] { title, description },
    results[] { title, description }
  },
  "blogs": *[_type == "blog" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc) [0...50] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "body": pt::text(content),
    publishedAt
  },
  "testimonials": *[_type == "testimonial" && featured == true] | order(_updatedAt desc) [0...20] {
    _id,
    name,
    role,
    company,
    content
  }
}`;
