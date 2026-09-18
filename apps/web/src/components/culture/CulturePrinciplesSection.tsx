import Image from "next/image";
import Link from "next/link";
import type { AboutPageData, MediaBlock } from "@/sanity/data/about";

function MediaRenderer({
  media,
  priority,
  sizes,
}: {
  media: MediaBlock;
  priority?: boolean;
  sizes: string;
}) {
  if (!media.imageUrl && !media.videoUrl) {
    return <div className="absolute inset-0 size-full animate-pulse bg-[#c4c1b9]" />;
  }

  if (media.mediaType === "video" && media.videoUrl) {
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={media.videoThumbnailUrl || undefined}
        aria-label={media.videoTitle || "Culture video"}
        className="absolute inset-0 size-full object-cover"
      >
        <source src={media.videoUrl} type="video/mp4" />
        Your browser does not support the video element.
      </video>
    );
  }

  if (media.mediaType === "image" && media.imageUrl) {
    return (
      <Image
        src={media.imageUrl}
        alt={media.imageAlt || "Culture media"}
        fill
        sizes={sizes}
        className="object-cover"
        priority={priority}
      />
    );
  }

  return <div className="absolute inset-0 size-full animate-pulse bg-[#c4c1b9]" />;
}

function LargeImage({
  media,
  priority,
}: { media: MediaBlock, priority?: boolean }) {
  return (
    <div className="relative min-h-0 aspect-square overflow-hidden rounded-[5px] bg-[#d9d9d9] lg:h-full lg:aspect-auto">
      <MediaRenderer media={media} priority={priority} sizes="(min-width: 1024px) 43vw, 100vw" />
    </div>
  );
}

function PrincipleStory({
  body,
  link,
  label,
  media,
  statement,
}: {
  body: string;
  link: { href: string; label: string };
  label: string;
  media: MediaBlock;
  statement: string;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative aspect-[1.4/1] overflow-hidden rounded-[5px] bg-[#d9d9d9]">
        <MediaRenderer media={media} sizes="(min-width: 1024px) 38vw, 100vw" />
      </div>

      <div className="mt-[clamp(2rem,4.4vw,3rem)] flex flex-1 flex-col border-t border-white/70 pt-[clamp(0.75rem,1.4vw,1rem)]">
        <p className="wide-screen-body-sm text-[clamp(0.72rem,1.15vw,0.82rem)] leading-[1.32] tracking-[-0.02em] text-white whitespace-pre-wrap">
          {body}
        </p>

        {link.href && link.label && (
          <Link
            href={link.href}
            className="wide-screen-label group mt-2 flex items-center justify-end gap-3 text-[clamp(0.7rem,1.1vw,0.78rem)] font-semibold leading-none text-white"
          >
            {link.label}
            <Image
              src="/work-project-arrow.svg"
              alt=""
              width={12}
              height={12}
              aria-hidden="true"
              className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        )}

        <div className="wide-screen-body-lg font-display mt-auto flex items-end justify-between gap-5 pt-3 text-[clamp(0.9rem,1.6vw,1.05rem)] font-semibold leading-none tracking-[-0.035em] text-[#078633]">
          <p className="opacity-50">{label}</p>
          <p className="text-right">{statement}</p>
        </div>
      </div>
    </div>
  );
}

export default function CulturePrinciplesSection({
  principles,
}: { principles: AboutPageData["principles"] }) {
  if (principles.length === 0) return null;

  return (
    <section
      aria-label="ECAD design principles"
      className="wide-screen-gutter bg-linear-to-b from-[#1D2920] to-[#1B1D0A] px-[clamp(2rem,6.7vw,7rem)] pt-[clamp(8rem,10vw,12rem)] pb-[clamp(4rem,7vw,7rem)] text-white"
    >
      <div className="space-y-[clamp(4rem,9vw,9rem)]">
        {principles.map((principle, index) => {
          const textFirst = index % 2 !== 0;

          const story = (
            <PrincipleStory
              body={principle.story.description}
              link={principle.story.link}
              label={principle.story.label}
              media={principle.story.media}
              statement={principle.story.statement}
            />
          );

          const largeImage = (
            <LargeImage
              media={principle.primaryMedia}
              priority={index === 0}
            />
          );

          return (
            <article
              key={principle.story.label}
              className="grid items-stretch gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-[7.2vw]"
            >
              {textFirst ? story : largeImage}
              {textFirst ? largeImage : story}
            </article>
          );
        })}
      </div>
    </section>
  );
}
