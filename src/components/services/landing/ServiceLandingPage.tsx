import { ServiceBenefits } from "@/components/services/landing/ServiceBenefits";
import { ServiceFaqs } from "@/components/services/landing/ServiceFaqs";
import { ServiceFeatures } from "@/components/services/landing/ServiceFeatures";
import { ServiceGallery } from "@/components/services/landing/ServiceGallery";
import { ServiceLandingCta } from "@/components/services/landing/ServiceLandingCta";
import { ServiceLandingHero } from "@/components/services/landing/ServiceLandingHero";
import { ServiceOverview } from "@/components/services/landing/ServiceOverview";
import { ServiceProcess } from "@/components/services/landing/ServiceProcess";
import { ServiceTechnologies } from "@/components/services/landing/ServiceTechnologies";
import type { ServiceLanding } from "@/types/sanity";

type ServiceLandingPageProps = {
  service: ServiceLanding;
};

export function ServiceLandingPage({ service }: ServiceLandingPageProps) {
  return (
    <article>
      <ServiceLandingHero service={service} />
      <ServiceOverview service={service} />
      <ServiceBenefits service={service} />
      <ServiceFeatures service={service} />
      <ServiceTechnologies service={service} />
      <ServiceProcess service={service} />
      <ServiceGallery service={service} />
      <ServiceFaqs service={service} />
      <ServiceLandingCta service={service} />
    </article>
  );
}
