"use client";

import { useEffect, useState } from "react";

const MINIMUM_INSET = 16;
const MAXIMUM_INSET = 83.2;
const VIEWPORT_INSET_RATIO = 0.057;
const LARGE_DESKTOP_BREAKPOINT = 1920;
const LARGE_DESKTOP_INSET = 128;

export default function useResponsiveSectionInset() {
  const [inset, setInset] = useState(MINIMUM_INSET);

  useEffect(() => {
    const updateInset = () => {
      if (window.innerWidth >= LARGE_DESKTOP_BREAKPOINT) {
        setInset(LARGE_DESKTOP_INSET);
        return;
      }

      setInset(
        Math.min(
          MAXIMUM_INSET,
          Math.max(MINIMUM_INSET, window.innerWidth * VIEWPORT_INSET_RATIO),
        ),
      );
    };

    updateInset();
    window.addEventListener("resize", updateInset);

    return () => window.removeEventListener("resize", updateInset);
  }, []);

  return inset;
}
