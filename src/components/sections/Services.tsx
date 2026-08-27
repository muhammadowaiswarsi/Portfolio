import { ArrowUpRight } from "lucide-react";

import { ServiceCard } from "@/components/sections/ServiceCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getHomepageServices } from "@/sanity/lib/services";

export async function Services() {
  const services = await getHomepageServices();

  return (
    <section className="border-t border-border bg-background py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="WHAT WE DO"
            title="Digital Solutions Built Around Your Business"
            description="From strategy and design to development, AI and launch, we build digital solutions that create real business value."
          />
          <Button href="/services" className="w-fit shrink-0">
            Explore All Services
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Button>
        </div>

        {services.length > 0 ? (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service._id} service={service} index={index} />
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
          </div>
        )}
      </Container>
    </section>
  );
}
