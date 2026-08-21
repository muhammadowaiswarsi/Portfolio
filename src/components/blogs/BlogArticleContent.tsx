"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { BlogPortableText } from "@/components/blogs/BlogPortableText";
import { BlogRelated } from "@/components/blogs/BlogRelated";
import { fadeUp, formatPublishedDate, hasText } from "@/components/blogs/helpers";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { urlFor } from "@/sanity/lib/image";
import type { BlogArticle, BlogListItem } from "@/types/sanity";

type BlogArticleContentProps = {
  post: BlogArticle;
  relatedPosts?: BlogListItem[];
};

export function BlogArticleContent({
  post,
  relatedPosts = [],
}: BlogArticleContentProps) {
  const category = hasText(post.category) ? post.category.trim() : null;
  const publishedDate = formatPublishedDate(post.publishedAt);
  const coverUrl = post.coverImage?.asset
    ? urlFor(post.coverImage).width(1920).height(1080).fit("crop").url()
    : null;
  const coverAlt = post.coverImage?.alt || post.title;

  return (
    <article className="bg-background">
      <header className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_srgb,var(--primary)_22%,transparent),transparent_55%)]"
        />
        <Container className="relative">
          <div className="mx-auto max-w-3xl">
            <motion.p
              className="mb-5 text-sm font-medium text-accent"
              initial="hidden"
              animate="visible"
              custom={0.04}
              variants={fadeUp}
            >
              <Link href="/" className="transition-colors hover:text-accent-hover">
                Home
              </Link>
              <span className="mx-2 text-muted">»</span>
              <Link
                href="/blogs"
                className="transition-colors hover:text-accent-hover"
              >
                Blogs
              </Link>
            </motion.p>

            {category ? (
              <motion.p
                className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-accent"
                initial="hidden"
                animate="visible"
                custom={0.08}
                variants={fadeUp}
              >
                {category}
              </motion.p>
            ) : null}

            <motion.h1
              className="font-display text-4xl font-semibold leading-[1.12] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-[3.15rem]"
              initial="hidden"
              animate="visible"
              custom={0.12}
              variants={fadeUp}
            >
              {post.title}
            </motion.h1>

            <motion.p
              className="mt-6 text-base leading-7 text-muted sm:text-lg sm:leading-8"
              initial="hidden"
              animate="visible"
              custom={0.18}
              variants={fadeUp}
            >
              {post.excerpt}
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground/75"
              initial="hidden"
              animate="visible"
              custom={0.24}
              variants={fadeUp}
            >
              <span>{post.author}</span>
              {publishedDate ? (
                <>
                  <span className="text-primary" aria-hidden="true">
                    /
                  </span>
                  <time dateTime={post.publishedAt}>{publishedDate}</time>
                </>
              ) : null}
            </motion.div>
          </div>

          {coverUrl ? (
            <motion.div
              className="relative mt-12 overflow-hidden rounded-[1.75rem] border border-border bg-primary/30"
              initial="hidden"
              animate="visible"
              custom={0.3}
              variants={fadeUp}
            >
              <div className="relative aspect-[16/9]">
                <Image
                  src={coverUrl}
                  alt={coverAlt}
                  fill
                  priority
                  sizes="(min-width: 1280px) 1120px, 100vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          ) : null}
        </Container>
      </header>

      <section className="pb-16 sm:pb-20">
        <Container>
          <motion.div
            className="mx-auto max-w-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            custom={0.08}
            variants={fadeUp}
          >
            {post.content?.length ? (
              <BlogPortableText value={post.content} />
            ) : null}
          </motion.div>
        </Container>
      </section>

      <BlogRelated posts={relatedPosts} />

      <section className="relative overflow-hidden border-t border-border py-16 sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--primary)_28%,transparent),transparent_62%)]"
        />
        <Container className="relative">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            custom={0.08}
            variants={fadeUp}
          >
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-5xl">
              Have a Project in Mind?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Tell us what you want to build and we will help you turn it into a
              reliable digital product.
            </p>
            <div className="mt-8">
              <Button href="/contact" size="lg" className="rounded-full px-7">
                Let&apos;s Talk
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </article>
  );
}
