import { FALLBACK_DOCUMENTS } from "@/lib/chatbot/knowledge/static";
import type {
  SanityIndexingBlog,
  SanityIndexingCatalog,
  SanityIndexingProject,
  SanityIndexingService,
  SanityIndexingTestimonial,
  SanityTextPair,
} from "@/lib/rag/indexing/sanity";
import type { IndexDocument, RagDocumentType } from "@/lib/rag/types";

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

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function pushDoc(
  docs: IndexDocument[],
  doc: Omit<IndexDocument, "text"> & { text: string },
) {
  const text = cleanText(doc.text);
  if (!text || text.length < 24) return;
  if (!doc.title.trim()) return;
  docs.push({ ...doc, text });
}

function formatPairs(
  items: SanityTextPair[] | null | undefined,
  kind: "feature" | "faq" | "step",
) {
  if (!items?.length) return "";

  return items
    .map((item) => {
      if (kind === "faq") {
        const question = asString(item.question);
        const answer = asString(item.answer);
        if (!question || !answer) return "";
        return `Q: ${question}\nA: ${answer}`;
      }
      const title = asString(item.title);
      const description = asString(item.description);
      if (!title && !description) return "";
      return [title, description].filter(Boolean).join(": ");
    })
    .filter(Boolean)
    .join("\n\n");
}

function serviceUrl(slug: string) {
  return `/services/${slug}`;
}

function projectUrl(slug: string) {
  return `/portfolio/${slug}`;
}

function blogUrl(slug: string) {
  return `/blogs/${slug}`;
}

function normalizeService(service: SanityIndexingService): IndexDocument[] {
  const docs: IndexDocument[] = [];
  const slug = asString(service.slug);
  const title = asString(service.title);
  if (!slug || !title) return docs;

  const overview = [
    asString(service.shortDescription),
    asString(service.heroDescription),
    asString(service.overview),
    asStringArray(service.technologies).length
      ? `Technologies: ${asStringArray(service.technologies).join(", ")}.`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  pushDoc(docs, {
    documentId: service._id,
    documentType: "service",
    title,
    slug,
    url: serviceUrl(slug),
    section: "Overview",
    source: "sanity",
    text: `Title: ${title}\nSection: Overview\n\n${overview}`,
  });

  const features = formatPairs(service.features, "feature");
  if (features) {
    pushDoc(docs, {
      documentId: service._id,
      documentType: "service",
      title,
      slug,
      url: serviceUrl(slug),
      section: "Features",
      source: "sanity",
      text: `Title: ${title}\nSection: Features\n\n${features}`,
    });
  }

  const benefits = formatPairs(service.benefits, "feature");
  if (benefits) {
    pushDoc(docs, {
      documentId: service._id,
      documentType: "service",
      title,
      slug,
      url: serviceUrl(slug),
      section: "Benefits",
      source: "sanity",
      text: `Title: ${title}\nSection: Benefits\n\n${benefits}`,
    });
  }

  const process = formatPairs(service.process, "step");
  if (process) {
    pushDoc(docs, {
      documentId: service._id,
      documentType: "service",
      title,
      slug,
      url: serviceUrl(slug),
      section: "Process",
      source: "sanity",
      text: `Title: ${title}\nSection: Process\n\n${process}`,
    });
  }

  for (const [index, faq] of (service.faqs ?? []).entries()) {
    const question = asString(faq.question);
    const answer = asString(faq.answer);
    if (!question || !answer) continue;

    pushDoc(docs, {
      documentId: `${service._id}-faq-${index}`,
      documentType: "faq",
      title: question,
      slug,
      url: serviceUrl(slug),
      section: "FAQ",
      source: "sanity",
      text: `Title: ${title}\nSection: FAQ\n\nQ: ${question}\nA: ${answer}`,
    });
  }

  return docs;
}

function normalizeProject(project: SanityIndexingProject): IndexDocument[] {
  const docs: IndexDocument[] = [];
  const slug = asString(project.slug);
  const title = asString(project.title);
  if (!slug || !title) return docs;

  const overview = [
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
  ]
    .filter(Boolean)
    .join("\n\n");

  pushDoc(docs, {
    documentId: project._id,
    documentType: "project",
    title,
    slug,
    url: projectUrl(slug),
    section: "Overview",
    source: "sanity",
    text: `Title: ${title}\nSection: Overview\n\n${overview}`,
  });

  const goals = formatPairs(project.projectGoals, "feature");
  if (goals) {
    pushDoc(docs, {
      documentId: project._id,
      documentType: "project",
      title,
      slug,
      url: projectUrl(slug),
      section: "Goals",
      source: "sanity",
      text: `Title: ${title}\nSection: Goals\n\n${goals}`,
    });
  }

  const challenges = formatPairs(project.challenges, "feature");
  if (challenges) {
    pushDoc(docs, {
      documentId: project._id,
      documentType: "project",
      title,
      slug,
      url: projectUrl(slug),
      section: "Challenges",
      source: "sanity",
      text: `Title: ${title}\nSection: Challenges\n\n${challenges}`,
    });
  }

  const approach = formatPairs(project.approach, "feature");
  if (approach) {
    pushDoc(docs, {
      documentId: project._id,
      documentType: "project",
      title,
      slug,
      url: projectUrl(slug),
      section: "Approach",
      source: "sanity",
      text: `Title: ${title}\nSection: Approach\n\n${approach}`,
    });
  }

  const features = formatPairs(project.keyFeatures, "feature");
  if (features) {
    pushDoc(docs, {
      documentId: project._id,
      documentType: "project",
      title,
      slug,
      url: projectUrl(slug),
      section: "Key Features",
      source: "sanity",
      text: `Title: ${title}\nSection: Key Features\n\n${features}`,
    });
  }

  const results = formatPairs(project.results, "feature");
  if (results) {
    pushDoc(docs, {
      documentId: project._id,
      documentType: "project",
      title,
      slug,
      url: projectUrl(slug),
      section: "Results",
      source: "sanity",
      text: `Title: ${title}\nSection: Results\n\n${results}`,
    });
  }

  return docs;
}

function normalizeBlog(post: SanityIndexingBlog): IndexDocument[] {
  const docs: IndexDocument[] = [];
  const slug = asString(post.slug);
  const title = asString(post.title);
  if (!slug || !title) return docs;

  const body = [asString(post.excerpt), asString(post.body)]
    .filter(Boolean)
    .join("\n\n");

  pushDoc(docs, {
    documentId: post._id,
    documentType: "blog",
    title,
    slug,
    url: blogUrl(slug),
    section: "Article",
    source: "sanity",
    publishedAt: asString(post.publishedAt) || undefined,
    text: `Title: ${title}\nSection: Article\n\n${body}`,
  });

  return docs;
}

function normalizeTestimonial(
  item: SanityIndexingTestimonial,
): IndexDocument[] {
  const docs: IndexDocument[] = [];
  const name = asString(item.name);
  const quote = asString(item.content);
  if (!name || !quote) return docs;

  const company = asString(item.company);
  const role = asString(item.role);
  const title = `${name}${company ? `, ${company}` : ""}`;

  pushDoc(docs, {
    documentId: item._id,
    documentType: "testimonial",
    title,
    url: "/",
    section: "Testimonial",
    source: "sanity",
    text: `Title: ${title}\nSection: Testimonial\n\n${quote} — ${name}${role ? `, ${role}` : ""}${company ? `, ${company}` : ""}.`,
  });

  return docs;
}

function normalizeStaticFallback(): IndexDocument[] {
  return FALLBACK_DOCUMENTS.map((document) => {
    const documentType: RagDocumentType =
      document.kind === "company" && document.id === "process"
        ? "process"
        : document.kind;

    return {
      documentId: document.id,
      documentType,
      title: document.title,
      url: document.url,
      section: "Company",
      source: "static" as const,
      text: `Title: ${document.title}\nSection: Company\n\n${document.content}`,
    };
  }).filter((doc) => cleanText(doc.text).length >= 24);
}

function technologiesDocument(catalog: SanityIndexingCatalog): IndexDocument[] {
  const technologies = [
    ...new Set([
      ...(catalog.services ?? []).flatMap((service) =>
        asStringArray(service.technologies),
      ),
      ...(catalog.projects ?? []).flatMap((project) =>
        asStringArray(project.technologies),
      ),
    ]),
  ].sort((a, b) => a.localeCompare(b));

  if (technologies.length === 0) return [];

  return [
    {
      documentId: "cms-technologies",
      documentType: "technology",
      title: "Technologies used in Computing Yard work",
      url: "/services",
      section: "Technologies",
      source: "sanity",
      text: `Title: Technologies used in Computing Yard work\nSection: Technologies\n\nTechnologies appearing in published Computing Yard services and projects: ${technologies.join(", ")}.`,
    },
  ];
}

export type NormalizeResult = {
  documents: IndexDocument[];
  counts: Record<string, number>;
  skipped: number;
};

export function normalizeIndexingCatalog(
  catalog: SanityIndexingCatalog,
): NormalizeResult {
  const documents: IndexDocument[] = [];
  let skipped = 0;

  const serviceCount = catalog.services?.length ?? 0;
  const projectCount = catalog.projects?.length ?? 0;
  const blogCount = catalog.blogs?.length ?? 0;
  const testimonialCount = catalog.testimonials?.length ?? 0;

  for (const service of catalog.services ?? []) {
    const before = documents.length;
    documents.push(...normalizeService(service));
    if (documents.length === before) skipped += 1;
  }

  for (const project of catalog.projects ?? []) {
    const before = documents.length;
    documents.push(...normalizeProject(project));
    if (documents.length === before) skipped += 1;
  }

  for (const blog of catalog.blogs ?? []) {
    const before = documents.length;
    documents.push(...normalizeBlog(blog));
    if (documents.length === before) skipped += 1;
  }

  for (const item of catalog.testimonials ?? []) {
    const before = documents.length;
    documents.push(...normalizeTestimonial(item));
    if (documents.length === before) skipped += 1;
  }

  documents.push(...technologiesDocument(catalog));
  documents.push(...normalizeStaticFallback());

  const byType: Record<string, number> = {};
  for (const document of documents) {
    byType[document.documentType] = (byType[document.documentType] ?? 0) + 1;
  }

  return {
    documents,
    counts: {
      servicesFetched: serviceCount,
      projectsFetched: projectCount,
      blogsFetched: blogCount,
      testimonialsFetched: testimonialCount,
      normalizedSections: documents.length,
      ...byType,
    },
    skipped,
  };
}
