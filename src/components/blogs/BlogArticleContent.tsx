"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { BlogPortableText } from "@/components/blogs/BlogPortableText";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { urlFor } from "@/sanity/lib/image";
import type { BlogArticle } from "@/types/sanity";

type BlogArticleContentProps = {
  post: BlogArticle;
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  }),
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

export function BlogArticleContent({ post }: BlogArticleContentProps) {
  const category =
    typeof post.category === "string" && post.category.trim()
      ? post.category.trim()
      : null;
  const publishedDate = formatPublishedDate(post.publishedAt);
  const coverUrl = post.coverImage?.asset
    ? urlFor(post.coverImage).width(1920).height(1080).fit("crop").url()
    : null;
  const coverAlt = post.coverImage?.alt || post.title;

  return (
    <article className="bg-background">
      <header className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            {category ? (
              <motion.p
                className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-accent"
                initial="hidden"
                animate="visible"
                custom={0.04}
                variants={fadeUp}
              >
                {category}
              </motion.p>
            ) : null}

            <motion.h1
              className="font-display text-4xl font-semibold leading-[1.12] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.15rem]"
              initial="hidden"
              animate="visible"
              custom={0.1}
              variants={fadeUp}
            >
              {post.title}
            </motion.h1>

            <motion.p
              className="mt-6 text-base leading-7 text-muted sm:text-lg sm:leading-8"
              initial="hidden"
              animate="visible"
              custom={0.16}
              variants={fadeUp}
            >
              {post.excerpt}
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/75"
              initial="hidden"
              animate="visible"
              custom={0.22}
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
              className="relative mt-12 overflow-hidden rounded-2xl border border-border bg-primary/30"
              initial="hidden"
              animate="visible"
              custom={0.28}
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

      <section className="relative overflow-hidden border-t border-border py-20 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,#2C5270_28%,transparent),transparent_62%)]"
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
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
              Have a Project in Mind?
            </h2>
            <div className="mt-8">
              <Button href="/contact" size="lg">
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
