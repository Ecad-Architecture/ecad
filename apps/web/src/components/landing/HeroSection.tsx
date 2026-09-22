"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import useResponsiveSectionInset from "./useResponsiveSectionInset";

interface HeroSlide {
  imageAlt: string;
  imageSrc: string;
  metadata: {
    category: string;
    location: string;
    status: string;
    year: string;
  };
  title: string;
}

interface HeroSectionProps {
  slides: readonly HeroSlide[];
}

const SLIDE_DURATION = 5000;

export default function HeroSection({ slides }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const horizontalInset = useResponsiveSectionInset();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroInset = useTransform(
    scrollYProgress,
    [0, 0.45],
    [0, horizontalInset],
  );

  const moveSlide = useCallback(
    (direction: -1 | 1) => {
      setActiveIndex(
        (current) =>
          (current + direction + slides.length) % slides.length,
      );
    },
    [slides.length],
  );

  useEffect(() => {
    if (isInfoOpen || slides.length < 2) {
      return;
    }

    const timeout = window.setTimeout(() => {
      moveSlide(1);
    }, SLIDE_DURATION);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, isInfoOpen, moveSlide, slides.length]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsInfoOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  const activeSlide = slides[activeIndex];
  const completedStatus =
    activeSlide.metadata.status.toLocaleLowerCase() === "completed"
      ? `${activeSlide.metadata.status} ${activeSlide.metadata.year}`
      : activeSlide.metadata.status;
  const metadata = [
    ["Status", completedStatus],
    ["Typology", activeSlide.metadata.category],
    ["Location", activeSlide.metadata.location],
  ] as const;

  return (
    <section
      ref={heroRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured ECAD projects"
      className="h-svh min-h-[34rem] bg-white"
    >
      <motion.div
        className="relative isolate h-full overflow-hidden bg-[#8d9ba3] text-white will-change-[margin]"
        style={{ marginInline: heroInset }}
      >
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={slide.imageSrc}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-[opacity,transform] duration-1000 ease-out ${
                isActive
                  ? "scale-100 opacity-100"
                  : "scale-[1.015] opacity-0"
              }`}
            >
              <Image
                src={slide.imageSrc}
                alt={isActive ? slide.imageAlt : ""}
                fill
                sizes="100vw"
                className="object-cover object-center"
                preload={index === 0}
              />
            </div>
          );
        })}

        <div
          aria-hidden="true"
          className="wide-screen-home-hero-overlay absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,transparent_28%,transparent_58%,rgba(0,0,0,0.38)_100%)]"
        />

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Show previous featured project"
              onClick={() => moveSlide(-1)}
              className="group absolute inset-y-0 left-0 z-10 hidden w-[clamp(5rem,12vw,11rem)] items-center justify-start pl-5 focus-visible:outline-none md:flex md:pl-8 lg:pl-[3.4vw]"
            >
              <Image
                src="/work-pagination-next.svg"
                alt=""
                width={42}
                height={42}
                className="size-10 rotate-180 opacity-0 drop-shadow-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:size-[42px]"
                unoptimized
              />
            </button>

            <button
              type="button"
              aria-label="Show next featured project"
              onClick={() => moveSlide(1)}
              className="group absolute inset-y-0 right-0 z-10 hidden w-[clamp(5rem,12vw,11rem)] items-center justify-end pr-5 focus-visible:outline-none md:flex md:pr-8 lg:pr-[3.4vw]"
            >
              <Image
                src="/work-pagination-next.svg"
                alt=""
                width={42}
                height={42}
                className="size-10 opacity-0 drop-shadow-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:size-[42px]"
                unoptimized
              />
            </button>
          </>
        ) : null}

        <div className={`wide-screen-max wide-screen-gutter pointer-events-none absolute inset-x-0 z-20 mx-auto mb-10 w-full max-w-[1600px] px-5 sm:bottom-[clamp(2rem,8.3vh,5.5rem)] md:px-8 lg:mb-0 lg:px-[6.8vw] transition-[bottom] duration-300 ${isInfoOpen ? "bottom-[4.5rem]" : "bottom-6"}`}>
          <div className="wide-screen-home-title-container w-50 lg:w-175">
            <p
              className={`grid font-display ${isInfoOpen ? "text-[30px] md:text-[38px] wide-screen-title-open" : "wide-screen-home-title wide-screen-title text-[38px] md:text-[62px]"} font-medium leading-none tracking-normal drop-shadow-sm transition-[font-size] duration-300`}
            >
              {/* Overlapping sizing copies reserve the tallest title at every breakpoint. */}
              {slides.map((slide, index) => (
                <span
                  key={`title-size-${index}`}
                  aria-hidden="true"
                  className="invisible col-start-1 row-start-1"
                >
                  {slide.title}
                </span>
              ))}
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={`${activeIndex}-${activeSlide.title}`}
                  aria-hidden="true"
                  className="col-start-1 row-start-1 self-end"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                  }}
                  exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeOut" } }}
                >
                  {activeSlide.title}
                </motion.span>
              </AnimatePresence>
              <span className="sr-only" aria-live="polite" aria-atomic="true">
                {activeSlide.title}
              </span>
            </p>
          </div>
        </div>

        <div className={`absolute left-6 right-[clamp(1.5rem,7.1vw,8rem)] z-20 flex min-w-0 flex-col items-start justify-between gap-1.5 text-white sm:bottom-[calc(clamp(2rem,8.3vh,5.5rem)+0.5rem)] md:bottom-[clamp(2.05rem,8.4vh,5.6rem)] md:left-auto md:flex-row md:items-center md:justify-end transition-[bottom] duration-300 ${isInfoOpen ? "bottom-[4.5rem]" : "bottom-6"}`}>
          <AnimatePresence initial={false}>
            {isInfoOpen && (
              <motion.dl
                id="hero-project-information"
                aria-label={`${activeSlide.title} project information`}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="wide-screen-home-metadata wide-screen-copy absolute left-0 top-full mt-1.5 flex w-full max-w-full origin-left items-center gap-2 overflow-x-auto whitespace-nowrap rounded-full border border-[#FFF684] bg-black/5 px-3 py-2 text-sm font-medium leading-none backdrop-blur-[2px] sm:px-5 md:static md:mt-0 md:me-4 md:w-auto md:origin-right"
              >
                {metadata.map(([label, value], index) => (
                  <div
                    key={label}
                    className={`flex shrink-0 items-center ${
                      index > 0
                        ? "before:mx-1.5 before:size-1 before:shrink-0 before:rounded-full before:bg-white/90 before:content-[''] sm:before:mx-2.5"
                        : ""
                    }`}
                  >
                    <dt className="sr-only">{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </motion.dl>
            )}
          </AnimatePresence>

          <button
            type="button"
            aria-expanded={isInfoOpen}
            aria-controls="hero-project-information"
            className={`wide-screen-home-info wide-screen-copy flex  shrink-0 items-center justify-center rounded-2xl border ${isInfoOpen ? 'border-[#FFF684]' : 'border-white/90'} bg-black/5 px-8 text-sm md:text-[24px] font-medium leading-none text-white backdrop-blur-[2px] transition-colors hover:bg-[#1A7B34]  focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white py-1`}
            onClick={() => setIsInfoOpen((current) => !current)}
          >
            Info
          </button>
        </div>
      </motion.div>
    </section>
  );
}
