import type { Metadata } from "next";
import {
  NextStudio,
  metadata as studioMetadata,
  viewport,
} from "next-sanity/studio";

import config from "../../../../sanity.config";

export const dynamic = "force-static";

export { viewport };

export const metadata: Metadata = {
  ...studioMetadata,
  title: "Computing Yard Studio",
};

export default function StudioPage() {
  return <NextStudio config={config} />;
}
