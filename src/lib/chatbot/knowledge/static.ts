import { siteDescription, siteName } from "@/lib/site";

import type { KnowledgeDocument } from "@/lib/chatbot/types";

export const FALLBACK_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: "company-overview",
    title: `${siteName} overview`,
    kind: "company",
    url: "/",
    content: `${siteDescription} Computing Yard is a software development studio. Detailed services, projects, and articles are published in the CMS and should be used when retrieved.`,
  },
  {
    id: "contact",
    title: "Contact Computing Yard",
    kind: "company",
    url: "/contact",
    content:
      "Start a project at /contact. Email info@computingyard.com. Phone +92 336 308 3049. Office: Office No. 08, Faiyaz Center, SMCHS Block A, Shahrah-e-Faisal, Karachi.",
  },
  {
    id: "process",
    title: "Delivery process",
    kind: "company",
    url: "/",
    content:
      "The public website describes the delivery process as Discover, Design, Develop, then Launch & Grow. Timelines depend on scope. Share an idea through /contact to get started.",
  },
];
