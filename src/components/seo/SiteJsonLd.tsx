import { getSiteUrl, siteDescription, siteName } from "@/lib/site";

export function SiteJsonLd() {
  const siteUrl = getSiteUrl();
  const organizationId = `${siteUrl}/#organization`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        url: siteUrl,
        description: siteDescription,
        email: "info@computingyard.com",
        telephone: "+92-336-308-3049",
        logo: `${siteUrl}/computing-yard-icon.png`,
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "Office No. 08, Faiyaz Center, SMCHS Block A, Shahrah-e-Faisal",
          addressLocality: "Karachi",
          addressCountry: "PK",
        },
        sameAs: [
          "https://www.linkedin.com/company/computingyard",
          "https://www.facebook.com/computingyard/",
          "https://www.instagram.com/computingyard/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: siteName,
        url: siteUrl,
        description: siteDescription,
        publisher: { "@id": organizationId },
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
