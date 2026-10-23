const AMI_CARD_ALT =
  "Laptop showing the Arabian Metal Industries website and its commercial vehicle bodies";

export function portfolioImageAlt(
  slug: string | null | undefined,
  alt: string | null | undefined,
  fallback: string,
) {
  const value = alt?.trim();

  if (
    slug === "arabian-metal-industries-ami" &&
    (!value || value === "Truck Body")
  ) {
    return AMI_CARD_ALT;
  }

  return value || fallback;
}
