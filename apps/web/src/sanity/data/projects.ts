import "server-only";

import type { SanityImageSource } from "@sanity/image-url";
import { cache } from "react";

import type {
  GalleryCategory,
  ProjectDetail,
  ProjectGalleryItem,
  WorkProject,
} from "@/components/work/types";
import { sanityClient, sanityFetch } from "@/sanity/lib/client";
import { getSanityImageUrl } from "@/sanity/lib/image";
import {
  WORK_PROJECT_METADATA_QUERY,
  WORK_PROJECT_QUERY,
  WORK_PROJECT_SLUGS_QUERY,
  WORK_PROJECTS_QUERY,
  HOME_FEATURED_PROJECTS_QUERY,
} from "@/sanity/queries/projects";

interface SanityContentImage {
  alt?: string | null;
  asset?: SanityImageSource | null;
}

interface SanityContentVideo {
  thumbnail?: SanityContentImage | null;
  title?: string | null;
  url?: string | null;
}

interface SanityGalleryItem {
  _key?: string | null;
  _type?: "contentImage" | "contentVideo" | string;
  alt?: string | null;
  asset?: SanityImageSource | null;
  thumbnail?: SanityContentImage | null;
  title?: string | null;
  url?: string | null;
}

interface SanityProjectRecord {
  _id: string;
  completionYear?: number | null;
  description?: string | null;
  heroMedia?: {
    image?: SanityContentImage | null;
    mediaType?: "image" | "video" | string;
    video?: SanityContentVideo | null;
  } | null;
  location?: string | null;
  media?: SanityGalleryItem[] | null;
  plans?: SanityGalleryItem[] | null;
  renders?: SanityGalleryItem[] | null;
  slug?: string | null;
  status?: string | null;
  title?: string | null;
  topology?: {
    _id?: string | null;
    slug?: string | null;
    title?: string | null;
  } | null;
}

interface SanityProjectMetadata {
  description?: string | null;
  title?: string | null;
}

function isDirectVideoUrl(url: string | null | undefined): url is string {
  return Boolean(url && /\.(mp4|webm|ogg)(?:$|[?#])/i.test(url));
}

function getHeroImage(project: SanityProjectRecord) {
  return project.heroMedia?.mediaType === "video"
    ? project.heroMedia.video?.thumbnail
    : project.heroMedia?.image;
}

function toWorkProject(project: SanityProjectRecord): WorkProject | null {
  const title = project.title?.trim();
  const slug = project.slug?.trim();
  const heroImage = getHeroImage(project);
  const imageSrc = getSanityImageUrl(heroImage?.asset, 2400);

  if (!title || !slug || !imageSrc) {
    return null;
  }

  return {
    category: project.topology?.title?.trim() || "Uncategorised",
    description: project.description?.trim() || "",
    imageAlt: heroImage?.alt?.trim() || title,
    imageSrc,
    location: project.location?.trim() || "",
    slug,
    status: project.status?.trim() || "",
    title,
    year: project.completionYear ? String(project.completionYear) : "",
  };
}

function toGalleryItems(
  items: SanityGalleryItem[] | null | undefined,
  projectTitle: string,
): ProjectGalleryItem[] {
  return (items || []).flatMap((item, index) => {
    const isVideo = item._type === "contentVideo";
    const image = isVideo
      ? item.thumbnail
      : { alt: item.alt, asset: item.asset };
    const src = getSanityImageUrl(image?.asset, 2400);

    if (!src) {
      return [];
    }

    const title = item.title?.trim();
    const alt = image?.alt?.trim() || title || `${projectTitle} gallery media`;
    const videoUrl = isDirectVideoUrl(item.url) ? item.url : undefined;

    return [
      {
        alt,
        key: item._key || `${item._type || "media"}-${index}`,
        kind: videoUrl ? "video" : "image",
        src,
        videoUrl,
      } satisfies ProjectGalleryItem,
    ];
  });
}

function galleryGroup(
  category: GalleryCategory,
  items: SanityGalleryItem[] | null | undefined,
  projectTitle: string,
) {
  return {
    category,
    items: toGalleryItems(items, projectTitle),
  } as const;
}

function toProjectDetail(project: SanityProjectRecord): ProjectDetail | null {
  const summary = toWorkProject(project);

  if (!summary) {
    return null;
  }

  const heroVideoUrl = isDirectVideoUrl(project.heroMedia?.video?.url)
    ? project.heroMedia?.video?.url
    : undefined;

  return {
    ...summary,
    galleryGroups: [
      galleryGroup("Plans", project.plans, summary.title),
      galleryGroup("Renders", project.renders, summary.title),
      galleryGroup("Media", project.media, summary.title),
    ],
    heroAlt: summary.imageAlt,
    heroSrc: summary.imageSrc,
    heroVideoUrl,
    overviewDescription: summary.description,
  };
}

export const getWorkProjects = cache(async () => {
  const projects = await sanityFetch<SanityProjectRecord[]>({
    query: WORK_PROJECTS_QUERY,
    tags: ["project", "topology"],
  });

  return projects.flatMap((project) => {
    const mappedProject = toWorkProject(project);
    return mappedProject ? [mappedProject] : [];
  });
});

export const getFeaturedProjects = cache(async () => {
  const projects = await sanityFetch<SanityProjectRecord[]>({
    query: HOME_FEATURED_PROJECTS_QUERY,
    tags: ["project", "topology"],
  });

  return projects.flatMap((project) => {
    const mappedProject = toWorkProject(project);
    return mappedProject ? [mappedProject] : [];
  });
});

export const getWorkProject = cache(async (slug: string) => {
  const project = await sanityFetch<SanityProjectRecord | null>({
    params: { slug },
    query: WORK_PROJECT_QUERY,
    tags: ["project", `project:${slug}`, "topology"],
  });

  return project ? toProjectDetail(project) : null;
});

export const getWorkProjectMetadata = cache(async (slug: string) =>
  sanityFetch<SanityProjectMetadata | null>({
    params: { slug },
    query: WORK_PROJECT_METADATA_QUERY,
    tags: ["project", `project:${slug}`],
  }),
);

export async function getWorkProjectSlugs() {
  const projects = await sanityClient
    .withConfig({ useCdn: false })
    .fetch<Array<{ slug?: string | null }>>(WORK_PROJECT_SLUGS_QUERY);

  return projects.flatMap(({ slug }) => (slug ? [{ slug }] : []));
}
