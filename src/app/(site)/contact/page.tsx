import type { Metadata } from "next";

import { ContactContent } from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your project, your goals and what you're looking to build. Our team will get back to you and discuss the next steps.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact",
    description:
      "Tell us about your project, your goals and what you're looking to build. Our team will get back to you and discuss the next steps.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
