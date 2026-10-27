import type { NextConfig } from "next";

import { canonicalSiteUrl, wwwHostname } from "./src/lib/site";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: wwwHostname }],
        destination: `${canonicalSiteUrl}/:path*`,
        statusCode: 301,
      },
      {
        source: "/blog",
        destination: "/blogs",
        statusCode: 301,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    inlineCss: true,
  },
};

export default nextConfig;
