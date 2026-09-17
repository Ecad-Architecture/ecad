import type { Metadata } from "next";

import WorkGallery from "@/components/work/WorkGallery";
import WorkHeroSlideshow from "@/components/work/WorkHeroSlideshow";
import { WorkIndexTransition } from "@/components/work/WorkPageTransition";

export const metadata: Metadata = {
  title: "Our Work | ECAD Architects",
  description:
    "Explore ECAD Architects' residential, commercial, industrial, mixed-use, and interior projects.",
};

export default function WorkPage() {
  return (
    <WorkIndexTransition>
      <WorkHeroSlideshow />

      <WorkGallery />
    </WorkIndexTransition>
  );
}
