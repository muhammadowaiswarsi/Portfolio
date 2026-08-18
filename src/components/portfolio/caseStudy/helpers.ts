import { urlFor } from "@/sanity/lib/image";
import type { CaseStudyItem, SanityImage } from "@/types/sanity";

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" as const },
  }),
};

export function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function hasItems<T>(value: T[] | null | undefined): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

export function hasImage(image?: SanityImage | null) {
  return Boolean(image?.asset);
}

export function getImageUrl(
  image: SanityImage | null | undefined,
  width: number,
  height?: number,
) {
  if (!image?.asset) return null;

  const builder = urlFor(image).width(width);
  return (height ? builder.height(height).fit("crop") : builder.fit("max")).url();
}

export function completeCaseStudyItems(items?: CaseStudyItem[] | null) {
  if (!hasItems(items)) return [];

  return items.filter(
    (item) => hasText(item.title) && hasText(item.description),
  );
}

export const caseStudyTitleClass =
  "font-sans font-semibold tracking-[-0.035em] text-white";

export const caseStudySectionClass =
  "font-sans font-semibold tracking-[-0.03em] text-white";

export const caseStudySubheadClass =
  "font-sans font-semibold tracking-[-0.02em] text-white";
