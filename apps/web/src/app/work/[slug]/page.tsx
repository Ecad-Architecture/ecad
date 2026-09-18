import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectDetailHero from "@/components/work/ProjectDetailHero";
import ProjectNavigation from "@/components/work/ProjectNavigation";
import ProjectOverview from "@/components/work/ProjectOverview";
import { ProjectDetailTransition } from "@/components/work/WorkPageTransition";
import {
  getWorkProject,
  getWorkProjects,
  getWorkProjectSlugs,
} from "@/sanity/data/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getWorkProjectSlugs();
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getWorkProject(slug);

  if (!project) {
    return {};
  }

  const title = project.title || "Project";
  const description = project.description || `Explore ${project.title} by ECAD Architects.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://ecadarchitects.com/work/${slug}`,
      images: project.heroSrc
        ? [
            {
              url: project.heroSrc,
              width: 1200,
              height: 630,
              alt: project.heroAlt || project.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.heroSrc ? [project.heroSrc] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([
    getWorkProject(slug),
    getWorkProjects(),
  ]);

  if (!project) {
    notFound();
  }

  const relatedProjects = projects.filter(
    (candidate) => candidate.slug !== project.slug,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: project.title,
    description: project.description,
    image: project.heroSrc,
    url: `https://ecadarchitects.com/work/${slug}`,
    creator: {
      "@type": "Organization",
      name: "ECAD Architects",
    },
  };

  return (
    <ProjectDetailTransition slug={slug}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetailHero project={project} />
      <ProjectOverview project={project} />
      <ProjectNavigation projects={relatedProjects} />
    </ProjectDetailTransition>
  );
}
