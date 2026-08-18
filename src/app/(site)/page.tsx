import { FeaturedPortfolio } from "@/components/sections/FeaturedPortfolio";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Technologies } from "@/components/sections/Technologies";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyComputingYard } from "@/components/sections/WhyComputingYard";

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
