import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogArticleContent } from "@/components/blogs/BlogArticleContent";
import { getAllBlogs, getBlogBySlug } from "@/sanity/lib/blogs";
import { urlFor } from "@/sanity/lib/image";

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllBlogs();

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return {
      title: "Article not found",
    };
  }

  const coverUrl = post.coverImage?.asset
    ? urlFor(post.coverImage).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blogs/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `/blogs/${slug}`,
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: coverUrl ? [{ url: coverUrl, alt: post.coverImage?.alt || post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: coverUrl ? [coverUrl] : undefined,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([
    getBlogBySlug(slug),
    getAllBlogs(),
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = posts.filter((item) => item.slug !== slug).slice(0, 3);

  return <BlogArticleContent post={post} relatedPosts={relatedPosts} />;
}
