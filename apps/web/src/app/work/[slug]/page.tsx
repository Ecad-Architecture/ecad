import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectDetailHero from "@/components/work/ProjectDetailHero";
import ProjectNavigation from "@/components/work/ProjectNavigation";
import ProjectOverview from "@/components/work/ProjectOverview";
import { ProjectDetailTransition } from "@/components/work/WorkPageTransition";
import {
  getWorkProject,
  getWorkProjectMetadata,
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
  const project = await getWorkProjectMetadata(slug);

  if (!project) {
    return {};
  }

  return {
    title: `${project.title} | ECAD Architects`,
    description: project.description,
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

  return (
    <ProjectDetailTransition slug={slug}>
      <ProjectDetailHero project={project} />
      <ProjectOverview project={project} />
      <ProjectNavigation projects={relatedProjects} />
    </ProjectDetailTransition>
  );
}
