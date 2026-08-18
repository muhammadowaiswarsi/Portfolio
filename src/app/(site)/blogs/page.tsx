import type { Metadata } from "next";

import { BlogCard } from "@/components/blogs/BlogCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllBlogs } from "@/sanity/lib/blogs";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Explore our latest thoughts, insights and practical knowledge about technology, design and digital products.",
};

export default async function BlogsPage() {
  const posts = await getAllBlogs();
  const [featuredPost, ...otherPosts] = posts;

  return (
    <section className="bg-background py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="INSIGHTS & BLOG"
          title="Ideas, Insights & Expertise"
          description="Explore our latest thoughts, insights and practical knowledge about technology, design and digital products."
        />

        {featuredPost ? (
          <div className="mt-14 space-y-6 lg:space-y-8">
            <BlogCard key={featuredPost._id} post={featuredPost} index={0} featured />
            {otherPosts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
                {otherPosts.map((post, index) => (
                  <BlogCard key={post._id} post={post} index={index + 1} />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-14 rounded-2xl border border-border bg-surface px-6 py-16 text-center sm:py-20">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
              Coming Soon
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted sm:text-base sm:leading-7">
              Articles will appear here once they are published in Sanity.
            </p>
            <Button href="/contact" className="mt-8">
              Start a Project
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
