import { FeaturedPortfolio } from "@/components/sections/FeaturedPortfolio";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Technologies } from "@/components/sections/Technologies";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyComputingYard } from "@/components/sections/WhyComputingYard";
import { siteDescription, siteName, siteOgImage } from "@/lib/site";
import type { Metadata } from "next";

const homeTitle = `${siteName} | Web, Mobile & AI Software Development`;

export const metadata: Metadata = {
  title: {
    absolute: homeTitle,
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: homeTitle,
    description: siteDescription,
    url: "/",
    type: "website",
    siteName,
    locale: "en_US",
    images: [siteOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: siteDescription,
    images: [siteOgImage.url],
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedPortfolio />
      <Services />
      <WhyComputingYard />
      <Process />
      <Technologies />
      <Testimonials />
      <FinalCta />
    </>
  );
}
