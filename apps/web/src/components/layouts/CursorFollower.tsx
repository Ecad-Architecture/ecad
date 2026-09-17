"use client";

import { REDUCE_SITE_MOTION as prefersReducedMotion } from "@/motion";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";

import { SMOOTH_EASE } from "@/motion";

const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  "input:not(:disabled)",
  "textarea:not(:disabled)",
  "select:not(:disabled)",
  "summary",
  '[role="button"]',
  '[role="link"]',
  "label[for]",
].join(",");

export default function CursorFollower() {
  const x = useMotionValue(-24);
  const y = useMotionValue(-24);
  const smoothX = useSpring(x, { damping: 32, mass: 0.3, stiffness: 480 });
  const smoothY = useSpring(y, { damping: 32, mass: 0.3, stiffness: 480 });
  const isInteractiveRef = useRef(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateAvailability = () => setIsEnabled(finePointer.matches);

    const availabilityTimer = window.setTimeout(updateAvailability, 0);
    finePointer.addEventListener("change", updateAvailability);

    return () => {
      window.clearTimeout(availabilityTimer);
      finePointer.removeEventListener("change", updateAvailability);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled || prefersReducedMotion) {
      return;
    }

    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      x.set(event.clientX);
      y.set(event.clientY);
      setIsVisible(true);

      const target = event.target;
      const nextIsInteractive =
        target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR));

      if (nextIsInteractive !== isInteractiveRef.current) {
        isInteractiveRef.current = nextIsInteractive;
        setIsInteractive(nextIsInteractive);
      }
    };

    const hidePointer = () => setIsVisible(false);

    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("blur", hidePointer);
    document.documentElement.addEventListener("pointerleave", hidePointer);

    return () => {
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("blur", hidePointer);
      document.documentElement.removeEventListener("pointerleave", hidePointer);
    };
  }, [isEnabled, x, y]);

  if (!isEnabled || prefersReducedMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: smoothX, y: smoothY }}
      className="pointer-events-none fixed left-0 top-0 z-[1100] -ml-3 -mt-3 flex size-6 items-center justify-center will-change-transform"
    >
      <motion.span
        initial={false}
        animate={{
          backgroundColor: isInteractive ? "#FFF684" : "#14843B",
          boxShadow: isInteractive
            ? "0 0 0 0 rgba(255,255,255,0)"
            : "0 0 0 1px rgba(255,255,255,0.16)",
          height: isInteractive ? 23 : 12,
          opacity: isVisible ? 1 : 0,
          width: isInteractive ? 23 : 12,
        }}
        transition={{ duration: 0.24, ease: SMOOTH_EASE }}
        className="block shrink-0 rounded-full"
      />
    </motion.div>
  );
}
