import {
  isDemoTestimonial,
  UPWORK_FEATURED_TESTIMONIALS,
} from "@/lib/testimonials/upwork";
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

    const published = testimonials ?? [];
    const hasReal =
      published.length > 0 && published.some((item) => !isDemoTestimonial(item));

    if (hasReal) {
      return published.filter((item) => !isDemoTestimonial(item));
    }

    // Fallback: curated public Upwork client feedback while Sanity still has demos.
    return UPWORK_FEATURED_TESTIMONIALS;
  } catch {
    return UPWORK_FEATURED_TESTIMONIALS;
  }
}
