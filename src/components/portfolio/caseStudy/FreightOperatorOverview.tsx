import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const OVERVIEW_VIDEO =
  "https://app-logos-tms-new.s3.us-east-1.amazonaws.com/FreightOperator_SaaSLauchVideo_SecondDraft.mp4";

export function FreightOperatorOverview() {
  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Product Overview"
          title="See FreightOperator in action"
          description="A quick look at how carriers dispatch, track, and bill their entire drayage operation from one platform."
          headingClassName="font-display font-semibold"
        />
        <div className="mt-12 overflow-hidden rounded-[1.35rem] border border-border bg-black shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
          <video
            className="aspect-video w-full bg-black"
            controls
            playsInline
            preload="metadata"
            poster="/portfolio/freight-operator/live-tracking.jpg"
            aria-label="FreightOperator product overview"
          >
            <source src={OVERVIEW_VIDEO} type="video/mp4" />
          </video>
        </div>
      </Container>
    </section>
  );
}
