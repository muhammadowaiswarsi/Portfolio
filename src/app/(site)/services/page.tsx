import type { Metadata } from "next";

import { ServiceListingCard } from "@/components/services/ServiceListingCard";
import { ServicesCta } from "@/components/services/ServicesCta";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesPageFaqs } from "@/components/services/ServicesPageFaqs";
import { ServicesProcess } from "@/components/services/ServicesProcess";
import { ServicesStack } from "@/components/services/ServicesStack";
import { ServicesWhyChoose } from "@/components/services/ServicesWhyChoose";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getAllServices } from "@/sanity/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "We design, build and optimize digital experiences — from websites and mobile apps to AI-powered chatbots — that help businesses grow, engage customers and move forward.",
};

export default async function ServicesPage() {
  const services = await getAllServices();

  return (
    <>
      <ServicesHero />

      <section className="bg-background py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto mb-14 max-w-3xl text-center lg:mb-20">
            <h2 className="font-display text-4xl font-semibold leading-[1.15] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[3.15rem]">
              Our <span className="text-accent">Software & AI</span>{" "}
              Services
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              We deliver scalable, secure, and high-performance digital
              solutions — including web, mobile, AI chatbots, UI/UX and SEO —
              for startups, enterprises, and everything in between.
            </p>
          </div>

          {services.length > 0 ? (
            <div className="space-y-20 lg:space-y-28">
              {services.map((service, index) => (
                <ServiceListingCard
                  key={service._id}
                  service={service}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center sm:py-20">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
                Coming Soon
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted sm:text-base sm:leading-7">
                Services will appear here once they are published in Sanity.
              </p>
              <Button href="/contact" className="mt-8 rounded-full">
                Let&apos;s Talk
              </Button>
            </div>
          )}
        </Container>
      </section>

      <ServicesWhyChoose />
      <ServicesProcess />
      <ServicesStack />
      <ServicesPageFaqs />
      <ServicesCta />
    </>
  );
}
