"use client";

import { REDUCE_SITE_MOTION as prefersReducedMotion } from "@/motion";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { MOTION_DURATION, SMOOTH_EASE } from "@/motion";

type TransitionPhase = "idle" | "covering" | "covered" | "revealing";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const pendingHrefRef = useRef<string | null>(null);
  const sourcePathRef = useRef(pathname);
  const transitionInProgressRef = useRef(false);

  useEffect(() => {
    const startNavigationTransition = (event: globalThis.MouseEvent) => {
      if (
        prefersReducedMotion ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const eventTarget = event.target;
      const anchor =
        eventTarget instanceof Element
          ? eventTarget.closest<HTMLAnchorElement>("a[href]")
          : null;

      if (
        !anchor ||
        anchor.hasAttribute("data-project-transition") ||
        anchor.hasAttribute("download") ||
        anchor.getAttribute("target") === "_blank" ||
        anchor.getAttribute("aria-disabled") === "true"
      ) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);

      if (
        destination.origin !== window.location.origin ||
        destination.pathname === window.location.pathname
      ) {
        return;
      }

      event.preventDefault();

      if (transitionInProgressRef.current) {
        return;
      }

      transitionInProgressRef.current = true;
      sourcePathRef.current = pathname;
      pendingHrefRef.current = `${destination.pathname}${destination.search}${destination.hash}`;
      setPhase("covering");
    };

    document.addEventListener("click", startNavigationTransition, true);
    return () =>
      document.removeEventListener("click", startNavigationTransition, true);
  }, [pathname]);

  useEffect(() => {
    if (
      !transitionInProgressRef.current ||
      pathname === sourcePathRef.current
    ) {
      return;
    }

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        setPhase("revealing");
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [pathname]);

  const handleAnimationComplete = () => {
    if (phase === "covering" && pendingHrefRef.current) {
      setPhase("covered");
      router.push(pendingHrefRef.current);
      return;
    }

    if (phase === "revealing") {
      pendingHrefRef.current = null;
      transitionInProgressRef.current = false;
      sourcePathRef.current = pathname;
      setPhase("idle");
    }
  };

  const isCoverVisible = phase === "covering" || phase === "covered";

  return (
    <>
      <div className="flex flex-1 flex-col">{children}</div>

      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: isCoverVisible ? 1 : 0 }}
        transition={{ duration: MOTION_DURATION.page, ease: SMOOTH_EASE }}
        onAnimationComplete={handleAnimationComplete}
        className={`fixed inset-0 z-[60] isolate overflow-hidden bg-[#238A42] will-change-opacity ${
          phase === "idle" ? "pointer-events-none" : "pointer-events-auto"
        }`}
      >
        <div className="absolute left-1/2 top-1/2 aspect-[96/21] w-[min(78vw,75rem)] -translate-x-1/2 -translate-y-1/2 scale-110">
          <motion.div
            initial={false}
            animate={
              prefersReducedMotion
                ? { opacity: 0.3, scale: 1 }
                : {
                    opacity: [0.28, 0.5, 0.28],
                    scale: [1, 1.035, 1],
                  }
            }
            transition={{
              duration: 1.4,
              ease: SMOOTH_EASE,
              repeat: prefersReducedMotion ? 0 : Number.POSITIVE_INFINITY,
            }}
            className="relative h-full w-full will-change-[opacity,transform]"
          >
            <Image
              src="/ecad-full-logo-white.svg"
              alt=""
              fill
              sizes="78vw"
              className="object-contain"
              unoptimized
            />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
