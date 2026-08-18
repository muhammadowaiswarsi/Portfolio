import type { Metadata } from "next";

import { AboutContent } from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "Computing Yard is a technology partner focused on creating digital products and solutions that help businesses operate, grow and succeed in a digital-first world.",
};

export default function AboutPage() {
  return <AboutContent />;
}
