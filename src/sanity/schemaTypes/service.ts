import { defineArrayMember, defineField, defineType } from "sanity";

const imageAltField = defineField({
  name: "alt",
  title: "Alternative text",
  type: "string",
  validation: (rule) => rule.required(),
});

export const serviceBenefit = defineType({
  name: "serviceBenefit",
  title: "Service benefit",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(10).max(400),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      options: { hotspot: true },
      fields: [imageAltField],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "icon",
    },
  },
});

export const serviceFeature = defineType({
  name: "serviceFeature",
  title: "Service feature",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(10).max(600),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [imageAltField],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "image",
    },
  },
});

export const serviceProcessStep = defineType({
  name: "serviceProcessStep",
  title: "Process step",
  type: "object",
  fields: [
    defineField({
      name: "stepNumber",
      title: "Step number",
      type: "number",
      validation: (rule) => rule.integer().min(1).max(20),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(10).max(600),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      stepNumber: "stepNumber",
    },
    prepare({ title, subtitle, stepNumber }) {
      const step =
        typeof stepNumber === "number" ? `Step ${stepNumber}` : "Process step";

      return {
        title: title || step,
        subtitle: stepNumber ? `${step} — ${subtitle || ""}`.trim() : subtitle,
      };
    },
  },
});

export const serviceFaq = defineType({
  name: "serviceFaq",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required().min(4).max(200),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(10).max(800),
    }),
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "answer",
    },
  },
});

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  groups: [
    { name: "listing", title: "Listing", default: true },
    { name: "page", title: "Landing page" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "listing",
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "listing",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      group: "listing",
      rows: 3,
      validation: (rule) => rule.required().min(10).max(200),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      group: "listing",
      of: [{ type: "block" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      group: "listing",
      options: { hotspot: true },
      fields: [imageAltField],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "listing",
      description: "Optional flag for highlighting this service later.",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      group: "listing",
      description: "Optional sort order for listings. Lower numbers appear first.",
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "heroTitle",
      title: "Hero title",
      type: "string",
      group: "page",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "heroDescription",
      title: "Hero description",
      type: "text",
      group: "page",
      rows: 4,
      validation: (rule) => rule.max(400),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      group: "page",
      options: { hotspot: true },
      fields: [imageAltField],
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "array",
      group: "page",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      group: "page",
      of: [defineArrayMember({ type: "serviceBenefit" })],
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      group: "page",
      of: [defineArrayMember({ type: "serviceFeature" })],
    }),
    defineField({
      name: "process",
      title: "Our process",
      type: "array",
      group: "page",
      of: [defineArrayMember({ type: "serviceProcessStep" })],
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      group: "page",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "page",
      of: [defineArrayMember({ type: "serviceFaq" })],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "page",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [imageAltField],
        }),
      ],
    }),
    defineField({
      name: "featuresTitle",
      title: "Features section title",
      type: "string",
      group: "page",
      description: "Optional. Defaults to “What We Deliver”.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "benefitsTitle",
      title: "Benefits section title",
      type: "string",
      group: "page",
      description: "Optional. Defaults to “Benefits”.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "processTitle",
      title: "Process section title",
      type: "string",
      group: "page",
      description: "Optional. Defaults to “Our Process”.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "engagementsTitle",
      title: "Engagement options title",
      type: "string",
      group: "page",
      description: "Optional title for individual and dedicated-team options.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "engagements",
      title: "Engagement options",
      type: "array",
      group: "page",
      description:
        "Optional. Use for individual contributors and dedicated teams. Hidden when empty.",
      of: [defineArrayMember({ type: "serviceBenefit" })],
    }),
    defineField({
      name: "highlightsTitle",
      title: "Highlights section title",
      type: "string",
      group: "page",
      description: "Optional title for the highlights section.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      group: "page",
      description: "Optional reasons or differentiators. Hidden when empty.",
      of: [defineArrayMember({ type: "serviceBenefit" })],
    }),
    defineField({
      name: "ctaTitle",
      title: "CTA title",
      type: "string",
      group: "page",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "ctaDescription",
      title: "CTA description",
      type: "text",
      group: "page",
      rows: 3,
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Primary CTA label",
      type: "string",
      group: "page",
      description: "Optional hero button. Defaults to “Let's Talk”. Links to Contact.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "secondaryCtaLabel",
      title: "Secondary CTA label",
      type: "string",
      group: "page",
      description: "Optional second hero button. Hidden when empty. Links to Contact.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "ctaButtonLabel",
      title: "Closing CTA label",
      type: "string",
      group: "page",
      description: "Optional closing button. Defaults to “Let's Talk”. Links to Contact.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      group: "page",
      description: "Optional browser title. The site name is appended automatically.",
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      group: "page",
      rows: 3,
      validation: (rule) => rule.max(200),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "icon",
      subtitle: "shortDescription",
    },
  },
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [
        { field: "order", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
});
