import { urlFor } from "@/sanity/lib/image";
import type { CaseStudyItem, CaseStudyProject, SanityImage } from "@/types/sanity";

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
  "font-display font-semibold tracking-[-0.035em] text-foreground";

export const caseStudySectionClass =
  "font-display font-semibold tracking-[-0.03em] text-foreground";

export const caseStudySubheadClass =
  "font-display font-semibold tracking-[-0.02em] text-foreground";

export function isWebMobileProject(project: CaseStudyProject) {
  if (project.projectType === "web-mobile") return true;

  const haystack = [
    project.businessType,
    ...(project.servicesProvided ?? []),
  ]
    .filter(hasText)
    .join(" ")
    .toLowerCase();

  return /web\s*(&|and)\s*mobile/.test(haystack);
}

export function isFrontendProject(project: CaseStudyProject) {
  const haystack = [
    project.businessType,
    ...(project.servicesProvided ?? []),
  ]
    .filter(hasText)
    .join(" ")
    .toLowerCase();

  return /frontend/.test(haystack);
}

export function isMobileAppProject(project: CaseStudyProject) {
  if (isWebMobileProject(project)) return false;

  const haystack = [
    project.businessType,
    project.category,
    ...(project.servicesProvided ?? []),
  ]
    .filter(hasText)
    .join(" ")
    .toLowerCase();

  return /mobile app|ios|android|react native/.test(haystack);
}

export function isEcommerceProject(project: CaseStudyProject) {
  if (isMobileAppProject(project) || isWebMobileProject(project)) return false;

  const haystack = [project.businessType, project.industry]
    .filter(hasText)
    .join(" ")
    .toLowerCase();

  return /e-?commerce|online store|webshop/.test(haystack);
}

export function isWebAppProject(project: CaseStudyProject) {
  if (isEcommerceProject(project)) return false;
  if (isWebMobileProject(project)) return true;
  if (isMobileAppProject(project)) return false;

  const type = (project.businessType ?? "").toLowerCase();
  return /web application|web platform|web app/.test(type);
}

export function isWebScreen(image?: SanityImage | null) {
  if (!hasImage(image) || !image) return false;
  return /web dashboard|web analytics|web platform|website/i.test(
    image.alt || "",
  );
}

export function isPhoneScreen(image?: SanityImage | null) {
  if (!hasImage(image) || !image) return false;
  if (isWebScreen(image)) return false;
  return /mobile app|app screen|^login\b|^sign up\b|^payment profile/i.test(
    image.alt || "",
  );
}

export function isGraphicShowcase(image?: SanityImage | null) {
  if (!hasImage(image) || !image) return false;
  return /^(showcase|portrait)\b/i.test(image.alt || "");
}

export function imagesMatching(
  images: SanityImage[] | null | undefined,
  pattern: RegExp,
) {
  return (images ?? []).filter(
    (image) => hasImage(image) && pattern.test(image.alt || ""),
  );
}

export function firstMatching(
  images: SanityImage[] | null | undefined,
  pattern: RegExp,
) {
  return imagesMatching(images, pattern)[0] ?? null;
}
