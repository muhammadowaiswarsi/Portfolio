import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectCaseStudy } from "@/components/portfolio/caseStudy/ProjectCaseStudy";
import { getImageUrl, hasText } from "@/components/portfolio/caseStudy/helpers";
import { getAllProjects, getProjectBySlug } from "@/sanity/lib/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getAllProjects();

  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  const description = hasText(project.shortDescription)
    ? project.shortDescription
    : `Case study: ${project.title}`;
  const imageUrl = getImageUrl(project.thumbnail, 1200, 630);
  const imageAlt = project.thumbnail?.alt || project.title;

  return {
    title: project.title,
    description,
    alternates: {
      canonical: `/portfolio/${slug}`,
    },
    openGraph: {
      title: project.title,
      description,
      type: "article",
      url: `/portfolio/${slug}`,
      images: imageUrl ? [{ url: imageUrl, alt: imageAlt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([
    getProjectBySlug(slug),
    getAllProjects(),
  ]);

  if (!project) {
    notFound();
  }

  const relatedProjects = projects
    .filter((item) => item.slug !== slug)
    .slice(0, 2);

  return (
    <ProjectCaseStudy project={project} relatedProjects={relatedProjects} />
  );
}
