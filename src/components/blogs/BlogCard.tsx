"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/cn";
import type { BlogListItem } from "@/types/sanity";

type BlogCardProps = {
  post: BlogListItem;
  index: number;
  featured?: boolean;
};

function formatPublishedDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function BlogCard({ post, index, featured = false }: BlogCardProps) {
  const imageUrl = post.coverImage?.asset
    ? urlFor(post.coverImage)
        .width(featured ? 1600 : 1200)
        .height(featured ? 1000 : 800)
        .fit("crop")
        .url()
    : null;
  const imageAlt = post.coverImage?.alt || post.title;
  const href = `/blogs/${post.slug}`;
  const publishedDate = formatPublishedDate(post.publishedAt);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index, 5) * 0.08,
        ease: "easeOut",
      }}
      className={cn(
        "group overflow-hidden rounded-2xl border border-border bg-surface transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary",
        featured && "lg:grid lg:grid-cols-2",
        !featured && "flex h-full flex-col",
      )}
    >
      <Link href={href} className="relative block overflow-hidden">
        <div
          className={cn(
            "relative bg-primary/35",
            featured ? "aspect-[16/10] lg:h-full lg:min-h-[22rem] lg:aspect-auto" : "aspect-[16/10]",
          )}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes={
                featured
                  ? "(min-width: 1024px) 50vw, 100vw"
                  : "(min-width: 1024px) 50vw, 100vw"
              }
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              priority={featured}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A202C] via-[#1A202C]/15 to-transparent opacity-80" />
          <span className="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7 lg:p-8">
        {publishedDate ? (
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
            {publishedDate}
          </p>
        ) : null}

        <div className="space-y-3">
          <h2
            className={cn(
              "font-display font-semibold tracking-[-0.02em] text-white",
              featured ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl sm:text-2xl",
            )}
          >
            <Link href={href} className="transition-colors hover:text-accent">
              {post.title}
            </Link>
          </h2>
          <p className="text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
            {post.excerpt}
          </p>
        </div>

        <p className="mt-auto text-sm text-white/75">{post.author}</p>

        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          Read Article
          <ArrowUpRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </motion.article>
  );
}
