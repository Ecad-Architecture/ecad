"use client";

import { REDUCE_SITE_MOTION as shouldReduceMotion } from "@/motion";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { galleryCategories, type GalleryCategory, type ProjectDetail } from "./projectDetails";
import { getProjectGalleryImages } from "./projectGallery";

interface ProjectOverviewProps {
  project: ProjectDetail;
}

const GALLERY_TRANSITION_DURATION = 0.8;
type GalleryHighlight = { category: GalleryCategory } | { slot: number };

function getFirstVisibleIndex(track: HTMLDivElement) {
  const images = Array.from(track.querySelectorAll<HTMLElement>("[data-gallery-index]"));
  return Math.max(0, images.findLastIndex((image) => image.offsetLeft <= track.scrollLeft + 1));
}

export default function ProjectOverview({ project }: ProjectOverviewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [imageRatios, setImageRatios] = useState<Record<string, number>>({});
  const [shareStatus, setShareStatus] = useState("");
  const [hoveredImage, setHoveredImage] = useState<GalleryHighlight | null>(null);
  const [focusedImage, setFocusedImage] = useState<GalleryHighlight | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const mobileGalleryRef = useRef<HTMLDivElement>(null);
  const expandedImageRef = useRef<HTMLDivElement>(null);
  const isExpanded = activeImageIndex !== null;
  const galleryImages = useMemo(() => getProjectGalleryImages(project), [project]);
  const highlightedImage = hoveredImage ?? focusedImage;
  const activeCategory = highlightedImage
    ? "category" in highlightedImage
      ? highlightedImage.category
      : galleryImages[(galleryStartIndex + highlightedImage.slot) % galleryImages.length]?.category
    : galleryImages[galleryStartIndex]?.category;
  const categoryStarts = galleryCategories.map((category) => ({
    category,
    index: galleryImages.findIndex((image) => image.category === category),
  }));
  const visibleImageCount = Math.min(4, galleryImages.length);
  const visibleGalleryImages = Array.from(
    { length: visibleImageCount },
    (_, offset) => {
      const galleryIndex =
        (galleryStartIndex + offset) % galleryImages.length;

      return { galleryIndex, image: galleryImages[galleryIndex] };
    },
  );
  const activeImage =
    activeImageIndex === null ? null : galleryImages[activeImageIndex];

  const handleShare = async () => {
    try {
      const data = { title: `${project.title} | ECAD Architects`, url: window.location.href };
      if (navigator.share) {
        await navigator.share(data);
        setShareStatus("Project shared");
      } else {
        await navigator.clipboard.writeText(data.url);
        setShareStatus("Project link copied");
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setShareStatus("Unable to share this project");
      }
    }
  };

  const showGalleryIndex = useCallback((index: number) => {
    if (index < 0 || !galleryImages.length) return;
    const targetIndex = (index + galleryImages.length) % galleryImages.length;
    const track = mobileGalleryRef.current;
    if (track && window.matchMedia("(max-width: 767px)").matches) {
      const image = track.querySelector<HTMLElement>(`[data-gallery-index="${targetIndex}"]`);
      if (image) track.scrollTo({ left: image.offsetLeft, behavior: shouldReduceMotion ? "instant" : "smooth" });
    } else {
      setGalleryStartIndex(targetIndex);
    }
  }, [galleryImages.length]);

  const navigateGallery = useCallback((direction: -1 | 1) => {
    const wrap = (index: number) =>
      (index + direction + galleryImages.length) % galleryImages.length;

    if (isExpanded) {
      setActiveImageIndex((index) => index === null ? null : wrap(index));
    } else if (mobileGalleryRef.current && window.matchMedia("(max-width: 767px)").matches) {
      showGalleryIndex(wrap(getFirstVisibleIndex(mobileGalleryRef.current)));
    } else {
      setGalleryStartIndex(wrap);
    }
  }, [galleryImages.length, isExpanded, showGalleryIndex]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const syncMobilePosition = () => {
      const track = mobileGalleryRef.current;
      if (!mobileQuery.matches || !track) return;
      const image = track.querySelector<HTMLElement>(`[data-gallery-index="${galleryStartIndex}"]`);
      if (image) track.scrollTo({ left: image.offsetLeft, behavior: "instant" });
    };
    mobileQuery.addEventListener("change", syncMobilePosition);
    return () => mobileQuery.removeEventListener("change", syncMobilePosition);
  }, [galleryStartIndex]);

  useEffect(() => {
    const surface = isExpanded ? expandedImageRef.current : galleryRef.current;
    if (!surface || galleryImages.length < 2) return;

    let hovered = surface.matches(":hover");
    let wheelDistance = 0;
    let lastWheelTime = 0;
    let lastNavigation = -Infinity;
    const navigate = (direction: -1 | 1) => {
      const now = performance.now();
      if (now - lastNavigation < GALLERY_TRANSITION_DURATION * 1000) return;
      lastNavigation = now;
      navigateGallery(direction);
    };
    const onEnter = () => { hovered = true; };
    const onLeave = () => {
      hovered = false;
      wheelDistance = 0;
    };
    const onWheel = (event: WheelEvent) => {
      if (!isExpanded && window.matchMedia("(max-width: 767px)").matches) return;
      if (event.ctrlKey) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX : event.deltaY;
      if (!delta) return;
      event.preventDefault();
      const now = performance.now();
      if (now - lastNavigation < GALLERY_TRANSITION_DURATION * 1000) {
        wheelDistance = 0;
        return;
      }
      if (now - lastWheelTime > 200 || Math.sign(delta) !== Math.sign(wheelDistance)) {
        wheelDistance = 0;
      }
      lastWheelTime = now;
      wheelDistance += delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? surface.clientHeight : 1);
      if (Math.abs(wheelDistance) >= 40) {
        navigate(wheelDistance > 0 ? 1 : -1);
        wheelDistance = 0;
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if ((!isExpanded && !hovered && !surface.contains(document.activeElement)) ||
          event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
          (event.target instanceof HTMLElement &&
            (event.target.isContentEditable || event.target.closest("input, textarea, select")))) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        navigate(event.key === "ArrowRight" ? 1 : -1);
      }
    };

    surface.addEventListener("pointerenter", onEnter);
    surface.addEventListener("pointerleave", onLeave);
    surface.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("keydown", onKeyDown);
    return () => {
      surface.removeEventListener("pointerenter", onEnter);
      surface.removeEventListener("pointerleave", onLeave);
      surface.removeEventListener("wheel", onWheel);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [galleryImages.length, isExpanded, navigateGallery]);

  useEffect(() => {
    if (activeImageIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveImageIndex(null);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeImageIndex]);

  return (
    <>
      <section
        aria-labelledby="project-overview-title"
        className="relative isolate border-b border-[#fff684] bg-[#1D2921] text-white"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.025] mix-blend-screen"
          style={{
            maskImage: "linear-gradient(to bottom, rgb(0 0 0 / 0.08), black 85%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgb(0 0 0 / 0.08), black 85%)",
          }}
        >
          <Image
            src="/project-fingerprint-texture.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-left"
          />
        </div>
        <div className="wide-screen-max wide-screen-gutter relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-20 pt-12 md:px-[6.8vw] md:pb-[clamp(8rem,17vw,17rem)] md:pt-[clamp(3rem,5vw,5rem)]">
          <div className="grid items-start gap-8 md:grid-cols-2 md:gap-x-4 md:gap-y-0 lg:gap-x-6">
            <div>
              
              <h2
                id="project-overview-title"
                className="text-[clamp(1rem,1.65vw,1.5rem)] font-semibold uppercase leading-tight tracking-[-0.04em] text-[#168a3c]"
              >
                {project.title}
              </h2>

              <dl className="wide-screen-caption mt-4 flex flex-wrap gap-x-8 gap-y-3 text-[14px] font-medium tracking-[-0.02em] text-white md:text-[10px]">
                <div>
                  <dt className="sr-only">Location</dt>
                  <dd>{project.location}</dd>
                </div>
                <div>
                  <dt className="sr-only">Year</dt>
                  <dd>{project.year}</dd>
                </div>
                <div>
                  <dt className="sr-only">Typology</dt>
                  <dd>{project.category}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={handleShare}
                className="mt-8 inline-flex items-center gap-[7px] text-[11px] leading-none transition-colors hover:text-brand-yellow focus-visible:text-brand-yellow focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-yellow md:mb-10"
              >
                Share
                <svg
                  viewBox="0 0 12 12"
                  fill="currentColor"
                  aria-hidden="true"
                  className="size-2 shrink-0 mt-[1px]"
                >
                  <path d="M11.9912 1.00002C11.9912 0.447735 11.5435 1.94835e-05 10.9912 1.99049e-05L1.99119 2.00314e-05C1.43891 1.96942e-05 0.991191 0.447735 0.991191 1.00002C0.991191 1.5523 1.43891 2.00002 1.99119 2.00002L9.99119 2.00002L9.99119 10C9.99119 10.5523 10.4389 11 10.9912 11C11.5435 11 11.9912 10.5523 11.9912 10L11.9912 1.00002ZM0.707031 11.2842L1.41414 11.9913L11.6983 1.70713L10.9912 1.00002L10.2841 0.292913L-7.55191e-05 10.5771L0.707031 11.2842Z" />
                </svg>
              </button>
              <p className="sr-only" aria-live="polite">{shareStatus}</p>
            </div>

            <div
              role="region"
              aria-label="Project description"
              className="min-w-0"
            >
              <p className="wide-screen-small max-w-[42rem] whitespace-pre-line text-[14px] leading-[1.4] tracking-[-0.02em] text-white/95 lg:text-[15px]">
                {project.overviewDescription}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-7 md:col-start-1 md:row-start-2 md:mt-[-1.75rem] md:self-end" role="group" aria-label="Gallery categories">
              {categoryStarts.map(({ category, index }) => (
                <button
                  key={category}
                  type="button"
                  disabled={index < 0}
                  aria-controls="project-gallery"
                  aria-pressed={activeCategory === category}
                  onClick={() => showGalleryIndex(index)}
                  className={`wide-screen-caption py-2 text-[11px] font-medium transition-colors enabled:hover:text-[#fff684] focus-visible:text-[#fff684] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff684] disabled:cursor-not-allowed md:text-[14px] ${index < 0 ? "text-[#858d87]" : activeCategory === category ? "text-[#fff684]" : "text-white"}`}
                >
                  {category}
                </button>
              ))}
            </div>

          </div>

          <div id="project-gallery" ref={galleryRef} className="relative mt-6 md:mt-7" role="region" aria-label="Project gallery">
            <div
              className={`hidden gap-3 md:grid ${
                visibleImageCount === 1
                  ? "md:grid-cols-1"
                  : "md:grid-cols-4"
              }`}
            >
              {visibleGalleryImages.map(({ galleryIndex, image }, slot) => (
                <div key={slot} className={`relative overflow-hidden ${visibleImageCount === 1 ? "aspect-[16/10]" : "aspect-[0.77/1]"}`}>
                <button
                  type="button"
                  aria-label={`Expand ${image.category.toLowerCase()} image ${galleryIndex + 1}`}
                  onClick={() => setActiveImageIndex(galleryIndex)}
                  onMouseEnter={() => setHoveredImage({ slot })}
                  onMouseLeave={() => setHoveredImage(null)}
                  onFocus={(event) => {
                    if (event.currentTarget.matches(":focus-visible")) setFocusedImage({ slot });
                  }}
                  onBlur={() => setFocusedImage(null)}
                  className="group relative block h-full w-full overflow-hidden bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
                >
                  <AnimatePresence initial={false}>
                  <motion.div
                    key={image.src}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: GALLERY_TRANSITION_DURATION, ease: [0.42, 0, 0.58, 1] }}
                  >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={visibleImageCount === 1 ? "86vw" : "22vw"}
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025] group-focus-visible:scale-[1.025]"
                    onLoad={({ currentTarget }) => {
                      const ratio = currentTarget.naturalWidth / currentTarget.naturalHeight;
                      setImageRatios((ratios) => ratios[image.src] === ratio ? ratios : { ...ratios, [image.src]: ratio });
                    }}
                  />
                  </motion.div>
                  </AnimatePresence>
                </button>
                </div>
              ))}
            </div>

            <div
              ref={mobileGalleryRef}
              onScroll={(event) => setGalleryStartIndex(getFirstVisibleIndex(event.currentTarget))}
              style={{ scrollbarWidth: "none" }}
              className="relative flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden md:hidden"
            >
              {galleryImages.map((image, galleryIndex) => (
                <button
                  key={`${image.category}-${image.src}-${galleryIndex}`}
                  data-gallery-index={galleryIndex}
                  type="button"
                  aria-label={`Expand ${image.category.toLowerCase()} image ${galleryIndex + 1}`}
                  onClick={() => setActiveImageIndex(galleryIndex)}
                  onMouseEnter={() => setHoveredImage({ category: image.category })}
                  onMouseLeave={() => setHoveredImage(null)}
                  onFocus={(event) => {
                    if (event.currentTarget.matches(":focus-visible")) setFocusedImage({ category: image.category });
                  }}
                  onBlur={() => setFocusedImage(null)}
                  className={`group relative shrink-0 snap-start overflow-hidden bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:w-auto ${
                    visibleImageCount === 1
                      ? "aspect-[16/10] w-full"
                      : "aspect-[0.77/1] w-[78%]"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={
                      visibleImageCount === 1
                        ? "100vw"
                        : "(min-width: 768px) 22vw, 78vw"
                    }
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025] group-focus-visible:scale-[1.025]"
                    onLoad={({ currentTarget }) => {
                      const ratio =
                        currentTarget.naturalWidth /
                        currentTarget.naturalHeight;

                      setImageRatios((currentRatios) =>
                        currentRatios[image.src] === ratio
                          ? currentRatios
                          : { ...currentRatios, [image.src]: ratio },
                      );
                    }}
                  />
                </button>
              ))}
              {visibleImageCount > 1 ? <div aria-hidden="true" className="shrink-0 basis-[calc(22%-0.5rem)]" /> : null}
            </div>


          </div>
        </div>
      </section>

      {activeImage ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Expanded project image"
          onClick={() => setActiveImageIndex(null)}
          className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-white/25 px-4 py-4 backdrop-blur-[3px] sm:px-8 lg:px-12"
        >
          <div
            ref={expandedImageRef}
            className="relative max-w-[1500px] overflow-hidden"
            style={{
              aspectRatio: imageRatios[activeImage.src] ?? 1.5,
              width: `min(92vw, calc(88svh * ${imageRatios[activeImage.src] ?? 1.5}), 1500px)`,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              key={activeImage.src}
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="92vw"
              className="object-contain object-center"
              preload
              onLoad={({ currentTarget }) => {
                const ratio =
                  currentTarget.naturalWidth / currentTarget.naturalHeight;

                setImageRatios((currentRatios) =>
                  currentRatios[activeImage.src] === ratio
                    ? currentRatios
                    : { ...currentRatios, [activeImage.src]: ratio },
                );
              }}
            />

            {galleryImages.length > 1 && ([-1, 1] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                data-gallery-control
                aria-label={direction === -1 ? "Show previous project image" : "Show next project image"}
                onClick={() => setActiveImageIndex((index) => index === null ? null : (index + direction + galleryImages.length) % galleryImages.length)}
                className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-full drop-shadow-md transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${direction === -1 ? "left-3 sm:left-5" : "right-3 sm:right-5"}`}
              >
                <Image
                  src="/work-pagination-next.svg"
                  alt=""
                  width={42}
                  height={42}
                  className={`size-9 sm:size-[42px] ${direction === -1 ? "rotate-180" : ""}`}
                  unoptimized
                />
              </button>
            ))}

            <button
              type="button"
              data-gallery-control
              autoFocus
              aria-label="Close expanded project image"
              onClick={() => setActiveImageIndex(null)}
              className="absolute right-3 top-3 z-10 rounded-full transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:right-5 sm:top-5"
            >
              <Image
                src="/work-lightbox-close.svg"
                alt=""
                width={42}
                height={42}
                className="size-9 sm:size-[42px]"
                unoptimized
              />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
