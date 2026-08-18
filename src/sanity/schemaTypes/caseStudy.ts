import { defineField, defineType } from "sanity";

const imageAltField = defineField({
  name: "alt",
  title: "Alternative text",
  type: "string",
  validation: (rule) => rule.required(),
});

export const caseStudyItem = defineType({
  name: "caseStudyItem",
  title: "Case study item",
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

export const caseStudyChallenge = defineType({
  name: "caseStudyChallenge",
  title: "Challenge",
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
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});

export const projectClientTestimonial = defineType({
  name: "projectClientTestimonial",
  title: "Client testimonial",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 5,
      validation: (rule) => rule.max(800),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      options: { hotspot: true },
      fields: [imageAltField],
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (rule) => rule.integer().min(1).max(5),
    }),
  ],
});
