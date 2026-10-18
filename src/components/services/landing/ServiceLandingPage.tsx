import { MixpanelEntityView } from "@/components/analytics/MixpanelEntityView";
import { ServiceBenefits } from "@/components/services/landing/ServiceBenefits";
import { ServiceFaqs } from "@/components/services/landing/ServiceFaqs";
import { ServiceFeatures } from "@/components/services/landing/ServiceFeatures";
import { ServiceGallery } from "@/components/services/landing/ServiceGallery";
import { ServiceHighlights } from "@/components/services/landing/ServiceHighlights";
import { ServiceLandingCta } from "@/components/services/landing/ServiceLandingCta";
import { ServiceLandingHero } from "@/components/services/landing/ServiceLandingHero";
import { ServiceOverview } from "@/components/services/landing/ServiceOverview";
import { ServiceProcess } from "@/components/services/landing/ServiceProcess";
import { ServiceTechnologies } from "@/components/services/landing/ServiceTechnologies";
import { STAFF_AUGMENTATION_SLUG } from "@/sanity/content/staffAugmentation";
import { MIXPANEL_EVENTS } from "@/lib/mixpanel-events";
import type { ServiceLanding } from "@/types/sanity";

type ServiceLandingPageProps = {
  service: ServiceLanding;
};

export function ServiceLandingPage({ service }: ServiceLandingPageProps) {
  return (
    <article>
      <MixpanelEntityView
        event={MIXPANEL_EVENTS.VIEWED_SERVICE}
        name={service.title}
        slug={service.slug}
      />
      <ServiceLandingHero service={service} />
      <ServiceOverview service={service} />
      {service.engagements && service.engagements.length > 0 ? (
        <ServiceHighlights
          service={service}
          items={service.engagements}
          title={service.engagementsTitle}
          eyebrow="ENGAGEMENT OPTIONS"
          description={
            service.slug === STAFF_AUGMENTATION_SLUG
              ? "Both options add Computing Yard professionals to your work. The difference is whether you need one person inside your team, or several people focused on a project together."
              : undefined
          }
        />
      ) : null}
      {service.slug === STAFF_AUGMENTATION_SLUG ? (
        <ServiceFeatures service={service} />
      ) : null}
      <ServiceBenefits service={service} />
      {service.slug === STAFF_AUGMENTATION_SLUG ? null : (
        <ServiceFeatures service={service} />
      )}
      <ServiceTechnologies service={service} />
      <ServiceProcess service={service} />
      <ServiceHighlights service={service} />
      <ServiceGallery service={service} />
      <ServiceFaqs service={service} />
      <ServiceLandingCta service={service} />
    </article>
  );
}
