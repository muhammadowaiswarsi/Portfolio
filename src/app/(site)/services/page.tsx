import type { Metadata } from "next";

import { ServiceListingCard } from "@/components/services/ServiceListingCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllServices } from "@/sanity/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "From strategy and design to development and deployment, we create digital solutions tailored to your business.",
};

export default async function ServicesPage() {
  const services = await getAllServices();

  return (
    <section className="bg-background py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="OUR SERVICES"
          title="Digital Solutions Built for Growth"
          description="From strategy and design to development and deployment, we create digital solutions tailored to your business."
        />

        {services.length > 0 ? (
          <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
            {services.map((service, index) => (
              <ServiceListingCard
                key={service._id}
                service={service}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="mt-14 rounded-2xl border border-border bg-surface px-6 py-16 text-center sm:py-20">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
              Coming Soon
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted sm:text-base sm:leading-7">
              Services will appear here once they are published in Sanity.
            </p>
            <Button href="/contact" className="mt-8">
              Let&apos;s Talk
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
