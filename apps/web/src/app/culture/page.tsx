import type { Metadata } from "next";
import Image from "next/image";

import CultureOverviewSection from "@/components/culture/CultureOverviewSection";
import CulturePrinciplesSection from "@/components/culture/CulturePrinciplesSection";
import ClosingCallout from "@/components/shared/ClosingCallout";
import { getAboutPageData } from "@/sanity/data/about";

export const metadata: Metadata = {
  title: "Culture | ECAD Architects",
  description:
    "Discover the culture, people, and values behind ECAD Architects.",
};

export default async function CulturePage() {
  const pageData = await getAboutPageData();
  const hero = pageData?.hero;

  return (
    <main className="flex-1 bg-white">
      <section
        aria-label="ECAD Architects culture"
        className="wide-screen-gutter px-[clamp(1.25rem,3vw,3rem)] pt-[clamp(0.5rem,1.1vw,1rem)]"
      >
        <div className="relative aspect-[2.34/1] w-full overflow-hidden bg-[#d8d5ce] mt-5">
          {!hero ? (
            <div className="size-full animate-pulse bg-[#c4c1b9]" />
          ) : hero.mediaType === "video" && hero.videoUrl ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster={hero.videoThumbnailUrl || undefined}
              aria-label={hero.videoTitle || "Culture film"}
              className="size-full object-cover object-center"
            >
              <source src={hero.videoUrl} type="video/mp4" />
              Your browser does not support the video element.
            </video>
          ) : hero.mediaType === "image" && hero.imageUrl ? (
            <Image
              src={hero.imageUrl}
              alt={hero.imageAlt || "Culture hero"}
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
          ) : (
            <div className="size-full animate-pulse bg-[#c4c1b9]" />
          )}
        </div>
      </section>

      <CultureOverviewSection
        title={pageData.aboutTitle}
        introduction={pageData.introduction}
        resources={pageData.resources}
        beliefs={pageData.beliefs}
      />
      <CulturePrinciplesSection principles={pageData.principles} />
      <ClosingCallout
        title={pageData.callToAction.title}
        description={pageData.callToAction.description}
        linkLabel={pageData.callToAction.label}
        href={pageData.callToAction.href}
        backgroundImage={
          pageData.callToAction.backgroundUrl
            ? {
                src: pageData.callToAction.backgroundUrl,
                alt: pageData.callToAction.backgroundAlt || "Background",
              }
            : undefined
        }
        insetImage={
          pageData.callToAction.insetUrl
            ? {
                src: pageData.callToAction.insetUrl,
                alt: pageData.callToAction.insetAlt || "Inset image",
              }
            : undefined
        }
      />
    </main>
  );
}
