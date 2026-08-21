import { urlFor } from "@/sanity/lib/image";
import type {
  SanityImage,
  ServiceBenefit,
  ServiceFaq,
  ServiceFeature,
  ServiceProcessStep,
} from "@/types/sanity";

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

export function hasPortableText(
  value: unknown[] | null | undefined,
): value is unknown[] {
  if (!Array.isArray(value) || value.length === 0) return false;

  return value.some((block) => {
    if (!block || typeof block !== "object") return false;

    const item = block as {
      _type?: string;
      children?: Array<{ text?: string }>;
    };

    if (item._type && item._type !== "block") return true;
    if (!Array.isArray(item.children)) return false;

    return item.children.some(
      (child) => typeof child?.text === "string" && child.text.trim().length > 0,
    );
  });
}

export function completeBenefits(items?: ServiceBenefit[] | null) {
  if (!hasItems(items)) return [];

  return items.filter(
    (item) => hasText(item.title) && hasText(item.description),
  );
}

export function completeFeatures(items?: ServiceFeature[] | null) {
  if (!hasItems(items)) return [];

  return items.filter(
    (item) => hasText(item.title) && hasText(item.description),
  );
}

export function completeProcessSteps(items?: ServiceProcessStep[] | null) {
  if (!hasItems(items)) return [];

  return items
    .filter((item) => hasText(item.title) && hasText(item.description))
    .map((item, index) => ({
      ...item,
      displayNumber:
        typeof item.stepNumber === "number" && item.stepNumber > 0
          ? item.stepNumber
          : index + 1,
    }))
    .sort((a, b) => a.displayNumber - b.displayNumber);
}

export function completeFaqs(items?: ServiceFaq[] | null) {
  if (!hasItems(items)) return [];

  return items.filter(
    (item) => hasText(item.question) && hasText(item.answer),
  );
}

export function completeTechnologies(items?: string[] | null) {
  if (!hasItems(items)) return [];

  return items.map((item) => item.trim()).filter((item) => item.length > 0);
}
