export const galleryCategories = ["Plans", "Renders", "Media"] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

export interface ProjectGalleryItem {
  alt: string;
  key: string;
  kind: "image" | "video";
  src: string;
  videoUrl?: string;
}

export interface ProjectGalleryGroup {
  category: GalleryCategory;
  items: readonly ProjectGalleryItem[];
}

export interface WorkProject {
  category: string;
  description: string;
  imageAlt: string;
  imageSrc: string;
  location: string;
  slug: string;
  status: string;
  title: string;
  year: string;
}

export interface ProjectDetail extends WorkProject {
  galleryGroups: readonly ProjectGalleryGroup[];
  heroAlt: string;
  heroSrc: string;
  heroVideoUrl?: string;
  overviewDescription: string;
}
