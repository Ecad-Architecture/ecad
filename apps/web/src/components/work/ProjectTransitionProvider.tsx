"use client";

import { REDUCE_SITE_MOTION as prefersReducedMotion } from "@/motion";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";

import { MOTION_DURATION, SMOOTH_EASE } from "@/motion";

const PROJECT_NAVIGATION_DELAY = 500;
const PROJECT_ARRIVAL_HOLD = 450;
const PROJECT_TRANSITION_FINISH = 700;

interface TransitionBox {
  height: number;
  left: number;
  top: number;
  width: number;
}

type TransitionPhase = "leaving" | "arriving" | "finishing";

interface ProjectTransition {
  alt: string;
  href: string;
  imageSrc: string;
  origin: TransitionBox;
  phase: TransitionPhase;
  slug: string;
  target: TransitionBox;
}

interface StartProjectTransitionOptions {
  alt: string;
  href: string;
  imageElement: HTMLElement;
  imageSrc: string;
  slug: string;
}

interface ProjectTransitionContextValue {
  startProjectTransition: (
    event: MouseEvent<HTMLAnchorElement>,
    options: StartProjectTransitionOptions,
  ) => void;
  transition: ProjectTransition | null;
}

const ProjectTransitionContext =
  createContext<ProjectTransitionContextValue | null>(null);

function toBox(rect: DOMRect): TransitionBox {
  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  };
}

function getExpectedHeroBox(): TransitionBox {
  return {
    height: window.innerHeight,
    left: 0,
    top: 0,
    width: window.innerWidth,
  };
}

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

export function useProjectTransition() {
  const context = useContext(ProjectTransitionContext);

  if (!context) {
    throw new Error(
      "useProjectTransition must be used inside ProjectTransitionProvider",
    );
  }

  return context;
}

export default function ProjectTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [transition, setTransition] = useState<ProjectTransition | null>(null);
  const isTransitioningRef = useRef(false);
  const navigationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const startProjectTransition = useCallback(
    (
      event: MouseEvent<HTMLAnchorElement>,
      options: StartProjectTransitionOptions,
    ) => {
      if (isModifiedClick(event) || isTransitioningRef.current) {
        return;
      }

      event.preventDefault();

      if (prefersReducedMotion) {
        router.push(options.href);
        return;
      }

      isTransitioningRef.current = true;
      const origin = toBox(options.imageElement.getBoundingClientRect());

      setTransition({
        alt: options.alt,
        href: options.href,
        imageSrc: options.imageSrc,
        origin,
        phase: "leaving",
        slug: options.slug,
        target: getExpectedHeroBox(),
      });

      navigationTimerRef.current = setTimeout(() => {
        router.push(options.href);
      }, PROJECT_NAVIGATION_DELAY);
    },
    [router],
  );

  const activeHref = transition?.href;
  const activeSlug = transition?.slug;

  useEffect(() => {
    if (!activeHref || !activeSlug || pathname !== activeHref) {
      return;
    }

    let arrivalTimer: ReturnType<typeof setTimeout>;
    let finishTimer: ReturnType<typeof setTimeout>;
    let firstFrame = 0;
    let secondFrame = 0;

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        const hero = document.querySelector<HTMLElement>(
          `[data-project-hero="${activeSlug}"]`,
        );

        setTransition((current) =>
          current
            ? {
                ...current,
                phase: "arriving",
                target: hero
                  ? toBox(hero.getBoundingClientRect())
                  : current.target,
              }
            : null,
        );

        arrivalTimer = setTimeout(() => {
          setTransition((current) =>
            current ? { ...current, phase: "finishing" } : null,
          );
        }, PROJECT_ARRIVAL_HOLD);

        finishTimer = setTimeout(() => {
          setTransition(null);
          isTransitioningRef.current = false;
        }, PROJECT_TRANSITION_FINISH);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      clearTimeout(arrivalTimer);
      clearTimeout(finishTimer);
    };
  }, [activeHref, activeSlug, pathname]);

  useEffect(
    () => () => {
      if (navigationTimerRef.current) {
        clearTimeout(navigationTimerRef.current);
      }
    },
    [],
  );

  const contextValue = useMemo(
    () => ({ startProjectTransition, transition }),
    [startProjectTransition, transition],
  );

  const overlayBox =
    transition?.phase === "leaving" ? transition.target : transition?.target;

  return (
    <ProjectTransitionContext.Provider value={contextValue}>
      {children}

      {transition && overlayBox ? (
        <motion.div
          aria-hidden="true"
          initial={{
            height: transition.origin.height,
            left: transition.origin.left,
            opacity: 1,
            top: transition.origin.top,
            width: transition.origin.width,
          }}
          animate={{
            height: overlayBox.height,
            left: overlayBox.left,
            opacity: transition.phase === "finishing" ? 0 : 1,
            top: overlayBox.top,
            width: overlayBox.width,
          }}
          transition={{
            duration:
              transition.phase === "arriving"
                ? MOTION_DURATION.projectArrival
                : MOTION_DURATION.project,
            ease: SMOOTH_EASE,
            opacity: {
              duration: MOTION_DURATION.projectFade,
              ease: SMOOTH_EASE,
            },
          }}
          className="pointer-events-none fixed z-[70] overflow-hidden bg-[#ece8dc] shadow-[0_12px_50px_rgba(0,0,0,0.08)] will-change-[height,left,opacity,top,width]"
        >
          <Image
            src={transition.imageSrc}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            preload
          />
        </motion.div>
      ) : null}
    </ProjectTransitionContext.Provider>
  );
}
