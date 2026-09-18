import type { Metadata } from "next";

import WorkGallery from "@/components/work/WorkGallery";
import WorkHeroSlideshow from "@/components/work/WorkHeroSlideshow";
import { WorkIndexTransition } from "@/components/work/WorkPageTransition";
import { getWorkProjects } from "@/sanity/data/projects";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Explore ECAD Architects' residential, commercial, industrial, mixed-use, and interior projects.",
};

export default async function WorkPage() {
  const projects = await getWorkProjects();

  return (
    <WorkIndexTransition>
      <WorkHeroSlideshow projects={projects} />

      <WorkGallery projects={projects} />
    </WorkIndexTransition>
  );
}
