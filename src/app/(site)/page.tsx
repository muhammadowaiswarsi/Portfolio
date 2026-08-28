import { FeaturedPortfolio } from "@/components/sections/FeaturedPortfolio";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Technologies } from "@/components/sections/Technologies";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyComputingYard } from "@/components/sections/WhyComputingYard";
import { siteDescription, siteName } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: `${siteName} | Web, Mobile & AI Software Development`,
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteName} | Web, Mobile & AI Software Development`,
    description: siteDescription,
    url: "/",
    type: "website",
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
