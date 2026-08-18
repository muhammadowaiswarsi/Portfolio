import { TestimonialCard } from "@/components/sections/TestimonialCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFeaturedTestimonials } from "@/sanity/lib/testimonials";

export async function Testimonials() {
  const testimonials = await getFeaturedTestimonials();

  return (
    <section className="border-t border-border bg-background py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="CLIENT FEEDBACK"
          title="What Our Clients Say"
          description="Trusted by businesses that rely on us to turn ideas into digital products that deliver."
        />

        {testimonials.length > 0 ? (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial._id}
                testimonial={testimonial}
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
              Client testimonials will appear here once they are published in
              Sanity.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
