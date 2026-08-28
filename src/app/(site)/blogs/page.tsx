import type { Metadata } from "next";

import { BlogCard } from "@/components/blogs/BlogCard";
import { BlogsHero } from "@/components/blogs/BlogsHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getAllBlogs } from "@/sanity/lib/blogs";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Explore practical insights, ideas and strategies across technology, design, AI and digital growth.",
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    title: "Blogs",
    description:
      "Explore practical insights, ideas and strategies across technology, design, AI and digital growth.",
    url: "/blogs",
    type: "website",
  },
};

export default async function BlogsPage() {
  const posts = await getAllBlogs();
  const [featuredPost, ...otherPosts] = posts;

  return (
    <>
      <BlogsHero />

      <section className="bg-background pb-16 sm:pb-20 lg:pb-24">
        <Container>
          <div className="mb-12 max-w-3xl lg:mb-16">
            <h2 className="font-display text-4xl font-semibold leading-[1.15] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[3.15rem]">
              Our <span className="text-accent">Blogs</span>
            </h2>
          </div>

          {featuredPost ? (
            <div className="space-y-6 lg:space-y-8">
              <BlogCard
                key={featuredPost._id}
                post={featuredPost}
                index={0}
                featured
              />
              {otherPosts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 lg:gap-8">
                  {otherPosts.map((post, index) => (
                    <BlogCard key={post._id} post={post} index={index + 1} />
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center sm:py-20">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
                Coming Soon
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted sm:text-base sm:leading-7">
                Articles will appear here once they are published in Sanity.
              </p>
              <Button href="/contact" className="mt-8 rounded-full">
                Let&apos;s Talk
              </Button>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
