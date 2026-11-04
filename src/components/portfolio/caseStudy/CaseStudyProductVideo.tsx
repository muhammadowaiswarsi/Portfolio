import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type CaseStudyProductVideoProps = {
  src: string;
  label: string;
  title: string;
  description: string;
  poster?: string;
};

export function CaseStudyProductVideo({
  src,
  label,
  title,
  description,
  poster,
}: CaseStudyProductVideoProps) {
  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Product Overview"
          title={title}
          description={description}
          headingClassName="font-display font-semibold"
        />
        <div className="mt-12 overflow-hidden rounded-[1.35rem] border border-border bg-black shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
          <video
            className="aspect-video w-full bg-black object-contain"
            controls
            playsInline
            preload="metadata"
            poster={poster}
            aria-label={label}
          >
            <source src={src} type="video/mp4" />
          </video>
        </div>
      </Container>
    </section>
  );
}
