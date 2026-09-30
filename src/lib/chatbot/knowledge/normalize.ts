import { KNOWLEDGE_LIMITS, type KnowledgeDocument } from "@/lib/chatbot/types";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function truncate(value: string, max = KNOWLEDGE_LIMITS.maxContentChars) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).trim()}…`;
}

function joinSections(parts: Array<string | undefined>) {
  return truncate(parts.filter(Boolean).join(" "));
}

type SanityTextItem = {
  title?: string | null;
  description?: string | null;
  question?: string | null;
  answer?: string | null;
};

export type SanityServiceRow = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  shortDescription?: string | null;
  heroDescription?: string | null;
  overview?: string | null;
  technologies?: string[] | null;
  features?: SanityTextItem[] | null;
  faqs?: SanityTextItem[] | null;
};

export type SanityProjectRow = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  shortDescription?: string | null;
  overview?: string | null;
  industry?: string | null;
  projectType?: string | null;
  technologies?: string[] | null;
  servicesProvided?: string[] | null;
};

export type SanityBlogRow = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  body?: string | null;
};

export type SanityTestimonialRow = {
  _id: string;
  name?: string | null;
  role?: string | null;
  company?: string | null;
  content?: string | null;
};

export type SanityKnowledgeCatalog = {
  services?: SanityServiceRow[] | null;
  projects?: SanityProjectRow[] | null;
  blogs?: SanityBlogRow[] | null;
  testimonials?: SanityTestimonialRow[] | null;
};

function summarizeItems(items: SanityTextItem[] | null | undefined, kind: "feature" | "faq") {
  if (!items) return "";

  return items
    .slice(0, 4)
    .map((item) => {
      if (kind === "faq") {
        const question = asString(item.question);
        const answer = asString(item.answer);
        if (!question || !answer) return "";
        return `Q: ${question} A: ${answer}`;
      }

      const title = asString(item.title);
      const description = asString(item.description);
      return [title, description].filter(Boolean).join(": ");
    })
    .filter(Boolean)
    .join(" ");
}

export function documentsFromCatalog(
  catalog: SanityKnowledgeCatalog,
): KnowledgeDocument[] {
  const documents: KnowledgeDocument[] = [];

  for (const service of catalog.services ?? []) {
    const slug = asString(service.slug);
    if (!slug || !asString(service.title)) continue;

    documents.push({
      id: service._id,
      title: asString(service.title),
      kind: "service",
      url: `/services/${slug}`,
      metadata: {
        slug,
        technologies: asStringArray(service.technologies),
      },
      content: joinSections([
        asString(service.shortDescription),
        asString(service.heroDescription),
        asString(service.overview),
        summarizeItems(service.features, "feature"),
        summarizeItems(service.faqs, "faq"),
        asStringArray(service.technologies).length
          ? `Technologies: ${asStringArray(service.technologies).join(", ")}.`
          : "",
      ]),
    });

    for (const faq of service.faqs ?? []) {
      const question = asString(faq.question);
      const answer = asString(faq.answer);
      if (!question || !answer) continue;

      documents.push({
        id: `${service._id}-faq-${question}`,
        title: question,
        kind: "faq",
        url: `/services/${slug}`,
        metadata: { slug },
        content: truncate(`${question} ${answer}`),
      });
    }
  }

  for (const project of catalog.projects ?? []) {
    const slug = asString(project.slug);
    if (!slug || !asString(project.title)) continue;

    documents.push({
      id: project._id,
      title: asString(project.title),
      kind: "project",
      url: `/portfolio/${slug}`,
      metadata: {
        slug,
        industry: asString(project.industry) || undefined,
        projectType: asString(project.projectType) || undefined,
        technologies: asStringArray(project.technologies),
      },
      content: joinSections([
        asString(project.shortDescription),
        asString(project.industry) ? `Industry: ${asString(project.industry)}.` : "",
        asString(project.projectType)
          ? `Project type: ${asString(project.projectType)}.`
          : "",
        asString(project.overview),
        asStringArray(project.servicesProvided).length
          ? `Services provided: ${asStringArray(project.servicesProvided).join(", ")}.`
          : "",
        asStringArray(project.technologies).length
          ? `Technologies: ${asStringArray(project.technologies).join(", ")}.`
          : "",
      ]),
    });
  }

  for (const post of catalog.blogs ?? []) {
    const slug = asString(post.slug);
    if (!slug || !asString(post.title)) continue;

    documents.push({
      id: post._id,
      title: asString(post.title),
      kind: "blog",
      url: `/blogs/${slug}`,
      metadata: { slug },
      content: joinSections([asString(post.excerpt), asString(post.body)]),
    });
  }

  for (const item of catalog.testimonials ?? []) {
    const quote = asString(item.content);
    const name = asString(item.name);
    if (!quote || !name) continue;

    documents.push({
      id: item._id,
      title: `${name}${asString(item.company) ? `, ${asString(item.company)}` : ""}`,
      kind: "testimonial",
      url: "/",
      content: truncate(
        `${quote} — ${name}${asString(item.role) ? `, ${asString(item.role)}` : ""}${
          asString(item.company) ? `, ${asString(item.company)}` : ""
        }.`,
      ),
    });
  }

  const technologies = [
    ...new Set(
      documents.flatMap((document) => document.metadata?.technologies ?? []),
    ),
  ].sort((a, b) => a.localeCompare(b));

  if (technologies.length > 0) {
    documents.push({
      id: "cms-technologies",
      title: "Technologies used in Computing Yard work",
      kind: "technology",
      url: "/services",
      metadata: { technologies },
      content: truncate(
        `Technologies appearing in published Computing Yard services and projects: ${technologies.join(", ")}.`,
      ),
    });
  }

  return documents;
}
