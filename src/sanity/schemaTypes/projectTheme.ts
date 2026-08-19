import { defineField, defineType } from "sanity";

function colorField(name: string, title: string, description: string) {
  return defineField({
    name,
    title,
    type: "string",
    description,
    validation: (rule) =>
      rule.required().regex(/^#([0-9A-Fa-f]{6})$/, {
        name: "hex color",
      }),
  });
}

export const projectColorTheme = defineType({
  name: "projectColorTheme",
  title: "Color theme",
  type: "object",
  fields: [
    colorField("primary", "Primary color", "Main brand color. Use a 6-digit hex value, e.g. #234B97."),
    colorField(
      "secondary",
      "Secondary / accent color",
      "Used for highlights, links, and CTAs. e.g. #00A9E2.",
    ),
    colorField("background", "Background color", "Page background. e.g. #FFFFFF."),
    colorField("text", "Text color", "Primary heading and body text. e.g. #1A202C."),
    colorField("mutedText", "Muted text color", "Supporting copy. e.g. #4A5369."),
    colorField("border", "Border color", "Dividers and outlines. e.g. #BACBE6."),
    colorField("surface", "Surface / card color", "Cards and panels. e.g. #F4F7FB."),
  ],
});

export const projectTypography = defineType({
  name: "projectTypography",
  title: "Typography",
  type: "object",
  fields: [
    defineField({
      name: "fontFamily",
      title: "Font family",
      type: "string",
      options: {
        list: [
          { title: "Open Sans", value: "Open Sans" },
          { title: "Roboto", value: "Roboto" },
          { title: "Montserrat", value: "Montserrat" },
          { title: "Inter", value: "Inter" },
          { title: "Syne", value: "Syne" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "fontWeight",
      title: "Heading weight",
      type: "string",
      options: {
        list: [
          { title: "Regular (400)", value: "400" },
          { title: "Medium (500)", value: "500" },
          { title: "Semibold (600)", value: "600" },
          { title: "Bold (700)", value: "700" },
        ],
        layout: "radio",
      },
      initialValue: "600",
    }),
  ],
});
