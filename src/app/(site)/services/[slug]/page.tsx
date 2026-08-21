import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceLandingPage } from "@/components/services/landing/ServiceLandingPage";
import { getImageUrl, hasText } from "@/components/services/landing/helpers";
import { getAllServices, getServiceBySlug } from "@/sanity/lib/services";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const services = await getAllServices();

  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service not found",
    };
  }

  const title = hasText(service.heroTitle) ? service.heroTitle : service.title;
  const description = hasText(service.heroDescription)
    ? service.heroDescription
    : service.shortDescription;
  const seoImage = service.heroImage?.asset ? service.heroImage : service.icon;
  const imageUrl = getImageUrl(seoImage, 1200, 630);
  const imageAlt = seoImage?.alt || title;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: imageUrl ? [{ url: imageUrl, alt: imageAlt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServiceLandingPage service={service} />;
}
