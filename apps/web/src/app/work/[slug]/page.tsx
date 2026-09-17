import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectDetailHero from "@/components/work/ProjectDetailHero";
import ProjectNavigation from "@/components/work/ProjectNavigation";
import ProjectOverview from "@/components/work/ProjectOverview";
import { ProjectDetailTransition } from "@/components/work/WorkPageTransition";
import {
  getProjectDetail,
  projectDetails,
} from "@/components/work/projectDetails";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projectDetails.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectDetail(slug);

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
  const project = getProjectDetail(slug);

  if (!project) {
    notFound();
  }

  return (
    <ProjectDetailTransition slug={slug}>
      <ProjectDetailHero project={project} />
      <ProjectOverview project={project} />
      <ProjectNavigation project={project} />
    </ProjectDetailTransition>
  );
}
