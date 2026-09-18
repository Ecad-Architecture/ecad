import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/client";
import { ABOUT_PAGE_QUERY } from "@/sanity/queries/about";

export interface MediaBlock {
  mediaType: "image" | "video";
  imageUrl: string;
  imageAlt: string;
  videoUrl: string;
  videoThumbnailUrl: string;
  videoTitle: string;
}

export interface AboutPageData {
  hero: MediaBlock;
  aboutTitle: string;
  introduction: string;
  resources: Array<{
    title: string;
    body: string;
  }>;
  beliefs: Array<{
    title: string;
    body: string;
  }>;
  principles: Array<{
    primaryMedia: MediaBlock;
    story: {
      media: MediaBlock;
      label: string;
      statement: string;
      description: string;
      link: {
        label: string;
        href: string;
      };
    };
  }>;
  callToAction: {
    title: string;
    description: string;
    label: string;
    href: string;
    backgroundUrl: string;
    backgroundAlt: string;
    insetUrl: string;
    insetAlt: string;
  };
}

interface RawMediaBlock {
  mediaType?: "image" | "video" | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  videoUrl?: string | null;
  videoThumbnailUrl?: string | null;
  videoTitle?: string | null;
}

interface RawAboutPageData {
  hero?: RawMediaBlock | null;
  aboutTitle?: string | null;
  introduction?: string | null;
  resources?: Array<{ title?: string | null; body?: string | null }> | null;
  beliefs?: Array<{ title?: string | null; body?: string | null }> | null;
  principles?: Array<{
    primaryMedia?: RawMediaBlock | null;
    story?: {
      media?: RawMediaBlock | null;
      label?: string | null;
      statement?: string | null;
      description?: string | null;
      link?: { label?: string | null; href?: string | null } | null;
    } | null;
  }> | null;
  callToAction?: {
    title?: string | null;
    description?: string | null;
    label?: string | null;
    href?: string | null;
    backgroundUrl?: string | null;
    backgroundAlt?: string | null;
    insetUrl?: string | null;
    insetAlt?: string | null;
  } | null;
}

function normalizeMediaBlock(raw?: RawMediaBlock | null): MediaBlock {
  return {
    mediaType: raw?.mediaType === "video" ? "video" : "image",
    imageUrl: raw?.imageUrl || "",
    imageAlt: raw?.imageAlt || "",
    videoUrl: raw?.videoUrl || "",
    videoThumbnailUrl: raw?.videoThumbnailUrl || "",
    videoTitle: raw?.videoTitle || "",
  };
}

export const getAboutPageData = cache(async (): Promise<AboutPageData> => {
  const data = await sanityFetch<RawAboutPageData | null>({
    query: ABOUT_PAGE_QUERY,
    tags: ["aboutPage"],
  });

  return {
    hero: normalizeMediaBlock(data?.hero),
    aboutTitle: data?.aboutTitle || "",
    introduction: data?.introduction || "",
    resources: (data?.resources || []).map((r) => ({
      title: r.title || "",
      body: r.body || "",
    })),
    beliefs: (data?.beliefs || []).map((b) => ({
      title: b.title || "",
      body: b.body || "",
    })),
    principles: (data?.principles || []).map((p) => ({
      primaryMedia: normalizeMediaBlock(p.primaryMedia),
      story: {
        media: normalizeMediaBlock(p.story?.media),
        label: p.story?.label || "",
        statement: p.story?.statement || "",
        description: p.story?.description || "",
        link: {
          label: p.story?.link?.label || "",
          href: p.story?.link?.href || "",
        },
      },
    })),
    callToAction: {
      title: data?.callToAction?.title || "",
      description: data?.callToAction?.description || "",
      label: data?.callToAction?.label || "",
      href: data?.callToAction?.href || "",
      backgroundUrl: data?.callToAction?.backgroundUrl || "",
      backgroundAlt: data?.callToAction?.backgroundAlt || "",
      insetUrl: data?.callToAction?.insetUrl || "",
      insetAlt: data?.callToAction?.insetAlt || "",
    },
  };
});
