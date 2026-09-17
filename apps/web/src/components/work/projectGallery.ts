import {
  galleryCategories,
  type GalleryCategory,
  type ProjectDetail,
} from "./types";

export interface GalleryImage {
  alt: string;
  category: GalleryCategory;
  key: string;
  kind: "image" | "video";
  src: string;
  videoUrl?: string;
}

export function getProjectGalleryImages(project: ProjectDetail): GalleryImage[] {
  return galleryCategories.flatMap((category) => {
    const group = project.galleryGroups.find(
      (candidate) => candidate.category === category,
    );

    return (group?.items || []).map((item) => ({ ...item, category }));
  });
}
