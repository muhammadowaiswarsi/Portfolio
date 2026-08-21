"use client";

import { motion } from "framer-motion";

import { BlogCard } from "@/components/blogs/BlogCard";
import { fadeUp } from "@/components/blogs/helpers";
import { Container } from "@/components/ui/Container";
import type { BlogListItem } from "@/types/sanity";

type BlogRelatedProps = {
  posts: BlogListItem[];
};

export function BlogRelated({ posts }: BlogRelatedProps) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <motion.h2
          className="mb-10 font-display text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          custom={0.04}
          variants={fadeUp}
        >
          Related <span className="text-accent">Articles</span>
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 lg:gap-8">
          {posts.map((post, index) => (
            <BlogCard key={post._id} post={post} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
