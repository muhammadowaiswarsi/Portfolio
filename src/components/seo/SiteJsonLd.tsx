import { getSiteUrl, siteDescription, siteName } from "@/lib/site";

export function SiteJsonLd() {
  const siteUrl = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: siteName,
        url: siteUrl,
        logo: `${siteUrl}/computing-yard-icon.png`,
      },
      {
        "@type": "WebSite",
        name: siteName,
        url: siteUrl,
        description: siteDescription,
        publisher: {
          "@type": "Organization",
          name: siteName,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
