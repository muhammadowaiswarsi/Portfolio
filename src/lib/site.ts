export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");

  if (explicit) {
    return explicit;
  }

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

  if (vercelHost) {
    return `https://${vercelHost.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}

export const siteName = "Computing Yard";

export const siteDescription =
  "Computing Yard is a premium software development agency building refined digital products — websites, web apps, mobile apps, and AI solutions.";

export const siteOgImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Computing Yard — Web, Mobile & AI Software Development",
  type: "image/png",
} as const;
