import { Quote, Star } from "lucide-react";
import Image from "next/image";

import { urlFor } from "@/sanity/lib/image";
import type { FeaturedTestimonial } from "@/types/sanity";

type TestimonialCardProps = {
  testimonial: FeaturedTestimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const avatarUrl = testimonial.avatar?.asset
    ? urlFor(testimonial.avatar).width(160).height(160).fit("crop").url()
    : null;
  const avatarAlt = testimonial.avatar?.alt || testimonial.name;
  const rating = Math.min(5, Math.max(0, Math.round(testimonial.rating || 0)));

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary sm:p-7">
      <Quote className="size-7 text-accent" aria-hidden="true" />

      <div
        className="mt-4 flex gap-1"
        role="img"
        aria-label={`${rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }, (_, starIndex) => (
          <Star
            key={starIndex}
            className={
              starIndex < rating
                ? "size-4 fill-accent text-accent"
                : "size-4 text-primary"
            }
            aria-hidden="true"
          />
        ))}
      </div>

      <p className="mt-5 flex-1 text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
        {testimonial.content}
      </p>

      <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={avatarAlt}
            width={48}
            height={48}
            className="size-12 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-12 items-center justify-center rounded-full border border-primary/50 bg-primary/25 text-sm font-medium text-foreground">
            {testimonial.name.charAt(0)}
          </span>
        )}
        <div>
          <p className="text-sm font-medium text-foreground">{testimonial.name}</p>
          <p className="text-xs leading-5 text-muted">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
    </article>
  );
}
