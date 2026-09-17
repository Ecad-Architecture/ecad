import {
  galleryCategories,
  type GalleryCategory,
  type ProjectDetail,
} from "./projectDetails";
import { workProjects } from "./projects";

export interface GalleryImage {
  alt: string;
  src: string;
  category: GalleryCategory;
}

// Preview-only omissions to demonstrate disabled labels. Explicit galleryGroups
// remain the source of truth when a project has its final assets.
const emptyPreviewCategories: Partial<Record<string, readonly GalleryCategory[]>> = {
  "the-pantheon": ["Media"],
  "ldp-office-tower": ["Plans"],
  "lakepoint-towers": ["Renders"],
};

export function getProjectGalleryImages(project: ProjectDetail): GalleryImage[] {
  const groups = project.galleryGroups;
  if (groups) {
    return galleryCategories.flatMap((category) =>
      groups
        .filter((group) => group.category === category)
        .flatMap((group) => group.images.map((image) => ({ ...image, category }))),
    );
  }

  // Temporary preview groups until project-specific Plans / Renders / Media
  // assets are supplied. Keep the existing demo imagery and order within groups.
  const images = [
    { src: project.overviewSrc, alt: project.overviewAlt },
    { src: project.poolSrc, alt: project.poolAlt },
    ...project.galleryImages,
    ...workProjects
      .filter((candidate) => candidate.slug !== project.slug)
      .map((candidate) => ({ src: candidate.imageSrc, alt: candidate.imageAlt })),
  ].filter((image, index, all) => all.findIndex((candidate) => candidate.src === image.src) === index);
  const groupSize = Math.ceil((images.length + 2) / galleryCategories.length);
  let imageOffset = 0;
  return galleryCategories.flatMap((category) => {
    const preview = category === "Renders"
      ? [{ src: "/gallery-preview/light-residence.png", alt: "AI-generated preview of a bright limestone residential building" }]
      : category === "Media"
        ? [{ src: "/gallery-preview/light-courtyard.png", alt: "AI-generated preview of a sunlit residential courtyard" }]
        : [];
    const groupImages = images.slice(imageOffset, imageOffset + groupSize - preview.length);
    imageOffset += groupImages.length;
    if (emptyPreviewCategories[project.slug]?.includes(category)) return [];
    return [...preview, ...groupImages]
      .map((image) => ({ ...image, category }));
  });
}
