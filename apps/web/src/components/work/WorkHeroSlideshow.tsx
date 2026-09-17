"use client";

import { REDUCE_SITE_MOTION as shouldReduceMotion } from "@/motion";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { type MouseEvent, useEffect, useRef, useState } from "react";

import { workProjects } from "./projects";
import { useProjectTransition } from "./ProjectTransitionProvider";

const SLIDE_DURATION = 5500;

export default function WorkHeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const { startProjectTransition } = useProjectTransition();
  const project = workProjects[currentIndex];
  const href = `/work/${project.slug}`;

  useEffect(() => {
    if (isPaused || shouldReduceMotion || workProjects.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % workProjects.length);
    }, SLIDE_DURATION);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!imageFrameRef.current) {
      return;
    }

    startProjectTransition(event, {
      alt: project.imageAlt,
      href,
      imageElement: imageFrameRef.current,
      imageSrc: project.imageSrc,
      slug: project.slug,
    });
  };

  return (
    <section
      aria-labelledby="work-hero-title"
      className="relative isolate h-svh min-h-[34rem] overflow-hidden bg-[#8d908d] text-white"
    >
      <div ref={imageFrameRef} className="absolute inset-0 overflow-hidden">
        <Link
          href={href}
          data-project-transition
          aria-label={`View ${project.title} project`}
          onClick={handleClick}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={project.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.15, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={project.imageSrc}
                alt={project.imageAlt}
                fill
                sizes="100vw"
                className="object-cover object-center transition-transform duration-[5500ms] ease-linear group-hover:scale-[1.015]"
                preload={currentIndex === 0}
              />
            </motion.div>
          </AnimatePresence>
        </Link>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,transparent_32%,transparent_55%,rgba(0,0,0,0.28)_100%)]"
      />

      <div className="wide-screen-max wide-screen-gutter pointer-events-none absolute inset-x-0 bottom-[clamp(3rem,9vh,6.25rem)] z-10 mx-auto w-full max-w-[1600px] px-5 md:px-8 lg:px-[6.8vw]">
        <h1
          id="work-hero-title"
          className="wide-screen-title text-[clamp(2.75rem,5.5vw,4rem)] font-semibold leading-none tracking-[-0.055em] drop-shadow-sm"
        >
          All Projects
        </h1>
      </div>
    </section>
  );
}
