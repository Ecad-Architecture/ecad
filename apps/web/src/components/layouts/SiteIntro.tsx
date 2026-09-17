"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { REDUCE_SITE_MOTION } from "@/motion";

const INTRO_STORAGE_KEY = "ecad-intro-seen-v1";
const SCENE_DURATION_MS = 2000;
const INTRO_DURATION_MS = 8000;
const REDUCED_MOTION_DURATION_MS = 1200;

const introScenes = [
  {
    background: "#238A42",
    text: "We begin with context.",
  },
  {
    background: "#1D2921",
    text: "We design with purpose.",
  },
  {
    background: "#FFF684",
    text: "We shape spaces around people.",
  },
  {
    background: "#8D908D",
    text: "We create for enduring impact.",
  },
] as const;

function setSiteContentInert(isInert: boolean) {
  ["ecad-app-shell", "footer-reveal"].forEach((id) => {
    const element = document.getElementById(id);

    if (!element) {
      return;
    }

    if (isInert) {
      element.setAttribute("inert", "");
      element.setAttribute("aria-hidden", "true");
      return;
    }

    element.removeAttribute("inert");
    element.removeAttribute("aria-hidden");
  });
}

export default function SiteIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const hasReleasedPage = useRef(false);

  const releasePage = useCallback(() => {
    if (hasReleasedPage.current) {
      return;
    }

    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      // Storage can be unavailable in strict privacy modes.
    }

    document.documentElement.dataset.ecadIntro = "seen";
    setSiteContentInert(false);
    hasReleasedPage.current = true;
  }, []);

  useEffect(() => {
    let hasSeenIntro = false;
    const forceIntro =
      new URLSearchParams(window.location.search).get("intro") === "1";

    try {
      hasSeenIntro = sessionStorage.getItem(INTRO_STORAGE_KEY) === "1";
    } catch {
      // If storage is unavailable, the intro can still run for this page load.
    }

    if (hasSeenIntro && !forceIntro) {
      document.documentElement.dataset.ecadIntro = "seen";
      setSiteContentInert(false);
      hasReleasedPage.current = true;
      return;
    }

    const reduceMotion = REDUCE_SITE_MOTION;
    const timers: number[] = [];

    document.documentElement.dataset.ecadIntro = "active";
    setSiteContentInert(true);
    timers.push(
      window.setTimeout(() => {
        setSceneIndex(0);
        setPrefersReducedMotion(reduceMotion);
        setIsVisible(true);
      }, 0),
    );

    if (reduceMotion) {
      timers.push(
        window.setTimeout(
          () => setIsVisible(false),
          REDUCED_MOTION_DURATION_MS,
        ),
      );
    } else {
      introScenes.slice(1).forEach((_, index) => {
        timers.push(
          window.setTimeout(
            () => setSceneIndex(index + 1),
            (index + 1) * SCENE_DURATION_MS,
          ),
        );
      });
      timers.push(
        window.setTimeout(() => setIsVisible(false), INTRO_DURATION_MS),
      );
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      document.documentElement.dataset.ecadIntro = "seen";
      setSiteContentInert(false);
    };
  }, []);

  const scene = introScenes[sceneIndex];
  const totalDuration = prefersReducedMotion
    ? REDUCED_MOTION_DURATION_MS / 1000
    : INTRO_DURATION_MS / 1000;

  return (
    <AnimatePresence onExitComplete={releasePage}>
      {isVisible && (
        <motion.div
          data-ecad-site-intro
          role="status"
          aria-label="Loading the ECAD website"
          className="fixed inset-0 z-[1000] isolate overflow-hidden text-white"
          initial={false}
          animate={{ backgroundColor: scene.background, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            backgroundColor: {
              duration: prefersReducedMotion ? 0 : 0.65,
              ease: [0.45, 0, 0.55, 1],
            },
            opacity: {
              duration: prefersReducedMotion ? 0 : 0.75,
              ease: [0.45, 0, 0.55, 1],
            },
          }}
        >
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 aspect-[96/21] w-[min(78vw,75rem)] -translate-x-1/2 -translate-y-1/2 scale-110 opacity-30 blur-[clamp(6px,1.2vw,18px)]"
          >
            <Image
              src="/ecad-full-logo-white.svg"
              alt=""
              fill
              priority
              unoptimized
              sizes="78vw"
              className="object-contain"
            />
          </div>

          <div className="relative z-10 flex h-full items-center justify-center px-5 pb-[clamp(2rem,5vw,5rem)] pt-5 md:px-10">
            <AnimatePresence initial={false} mode="wait">
              <motion.p
                key={scene.text}
                aria-live="polite"
                className="font-display max-w-[15ch] text-center text-[clamp(2rem,5.6vw,6.25rem)] font-medium leading-[0.98] tracking-[-0.045em] text-white"
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: 22, filter: "blur(8px)" }
                }
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -18, filter: "blur(8px)" }
                }
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.38,
                  ease: [0.45, 0, 0.55, 1],
                }}
              >
                {scene.text}
              </motion.p>
            </AnimatePresence>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[clamp(6px,0.65vw,11px)] bg-white"
          >
            <motion.div
              className="h-full origin-left bg-[#FFF684]"
              initial={prefersReducedMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0 : totalDuration,
                ease: "linear",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
