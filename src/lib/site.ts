/** Production hostname already used by canonical tags, robots, and the sitemap. */
export const canonicalHostname = "computingyard.com";
export const wwwHostname = "www.computingyard.com";
export const canonicalSiteUrl = `https://${canonicalHostname}`;

const productionHosts = new Set([canonicalHostname, wwwHostname]);

export function canonicalizeSiteUrl(value: string) {
  try {
    const url = new URL(value);
    if (productionHosts.has(url.hostname)) {
      return canonicalSiteUrl;
    }
    return url.origin;
  } catch {
    return value.replace(/\/$/, "");
  }
}

/**
 * Permanent redirect from the www host to the apex. Returns null for every
 * other host, including the apex, so the rule cannot redirect to itself.
 */
export function wwwToApexRedirect(host: string | null | undefined, requestUrl: string) {
  const hostname = host?.split(":")[0]?.toLowerCase();
  if (hostname !== wwwHostname) return null;

  const url = new URL(requestUrl);
  url.protocol = "https:";
  url.hostname = canonicalHostname;
  url.port = "";
  return url.toString();
}

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");

  if (explicit) {
    return canonicalizeSiteUrl(explicit);
  }

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

  if (vercelHost) {
    return canonicalizeSiteUrl(`https://${vercelHost.replace(/\/$/, "")}`);
  }

  return "http://localhost:3000";
}

/** Homepage URL, including the trailing slash used by the sitemap. */
export function getHomepageUrl() {
  return `${getSiteUrl()}/`;
}

export const siteName = "Computing Yard";

export const siteDescription =
  "Computing Yard is a software development company building websites, web apps, mobile apps, AI solutions, and staff augmentation that move businesses forward.";

export const siteOgImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Computing Yard — Web, Mobile & AI Software Development",
  type: "image/png",
} as const;
