import { groq } from "next-sanity";

export const chatbotKnowledgeCatalogQuery = groq`{
  "services": *[_type == "service" && defined(slug.current)] | order(coalesce(order, 9999) asc, _createdAt asc) [0...20] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    heroDescription,
    technologies,
    "overview": pt::text(overview),
    features[] { title, description },
    faqs[] { question, answer }
  },
  "projects": *[_type == "project" && defined(slug.current)] | order(_updatedAt desc) [0...30] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    industry,
    projectType,
    technologies,
    servicesProvided,
    "overview": pt::text(description)
  },
  "blogs": *[_type == "blog" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc) [0...20] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "body": pt::text(content)
  },
  "testimonials": *[_type == "testimonial" && featured == true] | order(_updatedAt desc) [0...8] {
    _id,
    name,
    role,
    company,
    content
  }
}`;
