import { CaseStudyProductVideo } from "@/components/portfolio/caseStudy/CaseStudyProductVideo";

const OVERVIEW_VIDEO =
  "https://app-logos-tms-new.s3.us-east-1.amazonaws.com/FreightOperator_SaaSLauchVideo_SecondDraft.mp4";

export function FreightOperatorOverview() {
  return (
    <CaseStudyProductVideo
      src={OVERVIEW_VIDEO}
      poster="/portfolio/freight-operator/live-tracking.jpg"
      label="FreightOperator product overview"
      title="See FreightOperator in action"
      description="A quick look at how carriers dispatch, track, and bill their entire drayage operation from one platform."
    />
  );
}
