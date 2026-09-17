"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

import { MOTION_DURATION, SMOOTH_EASE } from "@/motion";

import { useProjectTransition } from "./ProjectTransitionProvider";

export function WorkIndexTransition({ children }: { children: ReactNode }) {
  const { transition } = useProjectTransition();

  return (
    <motion.main
      animate={{ opacity: transition ? 0 : 1 }}
      transition={{ duration: MOTION_DURATION.page, ease: SMOOTH_EASE }}
      className="flex-1 bg-[#232323]"
    >
      {children}
    </motion.main>
  );
}

export function ProjectDetailTransition({
  children,
  slug,
}: {
  children: ReactNode;
  slug: string;
}) {
  const { transition } = useProjectTransition();
  const isActiveProject = transition?.slug === slug;

  return (
    <motion.main
      initial={isActiveProject ? { opacity: 0 } : false}
      animate={{
        opacity:
          isActiveProject && transition.phase === "leaving" ? 0 : 1,
      }}
      transition={{ duration: MOTION_DURATION.page, ease: SMOOTH_EASE }}
      className="flex-1"
    >
      {children}
    </motion.main>
  );
}
