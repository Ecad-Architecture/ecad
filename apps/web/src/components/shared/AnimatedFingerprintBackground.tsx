"use client";

import { REDUCE_SITE_MOTION as prefersReducedMotion } from "@/motion";

import { motion } from "motion/react";

const defaultColors = ["#c9dfd0", "#ead8cf", "#d4e0e8"] as const;

interface AnimatedFingerprintBackgroundProps {
  colors?: readonly string[];
  colorIntervalSeconds?: number;
  opacity?: number;
  patternLayers?: number;
  patternUrl?: string;
  patternRepeat?: "repeat" | "no-repeat";
  patternSize?: string;
  className?: string;
}

export default function AnimatedFingerprintBackground({
  colors = defaultColors,
  colorIntervalSeconds = 3,
  opacity = 0.55,
  patternLayers = 1,
  patternUrl = "/fingerprint-pattern-mask.png",
  patternRepeat = "repeat",
  patternSize = "clamp(320px, 33vw, 500px) auto",
  className = "",
}: AnimatedFingerprintBackgroundProps) {
  const resolvedColors = colors.length > 0 ? colors : defaultColors;
  const animatedColors = [...resolvedColors, resolvedColors[0]];
  const resolvedPatternLayers = Math.max(1, Math.round(patternLayers));
  const repeatMaskValue = (value: string) =>
    Array.from({ length: resolvedPatternLayers }, () => value).join(", ");
  const patternImage = repeatMaskValue(`url('${patternUrl}')`);
  const patternPosition = repeatMaskValue("center");
  const patternRepeatValue = repeatMaskValue(patternRepeat);
  const patternSizeValue = repeatMaskValue(patternSize);

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity,
        WebkitMaskImage: patternImage,
        WebkitMaskPosition: patternPosition,
        WebkitMaskRepeat: patternRepeatValue,
        WebkitMaskSize: patternSizeValue,
        maskImage: patternImage,
        maskPosition: patternPosition,
        maskRepeat: patternRepeatValue,
        maskSize: patternSizeValue,
      }}
      animate={{
        backgroundColor: prefersReducedMotion
          ? resolvedColors[0]
          : animatedColors,
      }}
      transition={{
        duration: prefersReducedMotion
          ? 0
          : colorIntervalSeconds * resolvedColors.length,
        ease: "easeInOut",
        repeat: prefersReducedMotion ? 0 : Infinity,
      }}
    />
  );
}
