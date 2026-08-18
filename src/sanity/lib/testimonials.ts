import { sanityFetch } from "@/sanity/lib/client";
import { featuredTestimonialsQuery } from "@/sanity/lib/queries";
import type { FeaturedTestimonial } from "@/types/sanity";

export async function getFeaturedTestimonials(): Promise<
  FeaturedTestimonial[]
> {
  try {
    const testimonials = await sanityFetch<FeaturedTestimonial[]>(
      featuredTestimonialsQuery,
    );

    return testimonials ?? [];
  } catch {
    return [];
  }
}
