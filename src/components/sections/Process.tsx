import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We understand your business, goals, users and project requirements.",
    image: "/process-discover.png",
    alt: "Discovery workshop with notes, sketches, and laptops",
  },
  {
    number: "02",
    title: "Design",
    description:
      "We transform ideas into intuitive, modern and purposeful digital experiences.",
    image: "/process-design.png",
    alt: "Designer shaping a mobile interface on a tablet",
  },
  {
    number: "03",
    title: "Develop",
    description:
      "Our engineers build scalable, secure and high-performance solutions.",
    image: "/process-develop.png",
    alt: "Engineering workstation with code and product screens",
  },
  {
    number: "04",
    title: "Launch & Grow",
    description:
      "We launch, monitor and continuously improve your product as your business grows.",
    image: "/process-launch.png",
    alt: "Live product on a phone with growth analytics on a laptop",
  },
] as const;

export function Process() {
  return (
    <section className="border-t border-border bg-background py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="HOW WE WORK"
          title="From Idea to Impact"
          description="A clear, collaborative process designed to turn your idea into a reliable digital product."
        />

        <ol className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step) => (
            <li key={step.number}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary">
                <div className="relative aspect-[4/3] overflow-hidden bg-background">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    sizes="(min-width: 1024px) 23vw, (min-width: 768px) 45vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full border border-accent/70 bg-background/90 text-sm font-medium tracking-wide text-accent backdrop-blur-sm">
                    {step.number}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
                    {step.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
