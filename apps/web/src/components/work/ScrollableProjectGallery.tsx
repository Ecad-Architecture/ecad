"use client";

import Image from "next/image";
import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import type { GalleryImage } from "./projectGallery";

export interface ScrollableGalleryHandle {
  show: (index: number) => void;
}

export default function ScrollableProjectGallery({ images, onSelect, onIndexChange, ref }: {
  images: readonly GalleryImage[];
  onSelect: (index: number) => void;
  onIndexChange: (index: number) => void;
  ref: Ref<ScrollableGalleryHandle>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const moveRef = useRef<(distance: number, replacePending?: boolean) => void>(() => {});

  useImperativeHandle(ref, () => ({
    show(index) {
      const track = trackRef.current;
      if (!track || !images.length) return;
      const image = track.children.item(index) as HTMLElement | null;
      if (!image) return;
      moveRef.current(image.offsetLeft - track.scrollLeft, true);
    },
  }), [images.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || images.length < 2) return;
    let frame = 0;
    let pending = 0;
    let lastTime = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tick = (time: number) => {
      const elapsed = lastTime ? Math.min(time - lastTime, 64) : 16;
      lastTime = time;
      const distance = reducedMotion.matches ? pending : pending * (1 - Math.exp(-elapsed / 65));
      pending -= distance;
      track.scrollLeft += distance;
      if (Math.abs(pending) > 0.5) frame = requestAnimationFrame(tick);
      else {
        track.scrollLeft += pending;
        pending = 0;
        frame = 0;
        lastTime = 0;
      }
    };
    moveRef.current = (distance, replacePending = false) => {
      const target = Math.max(0, Math.min(track.scrollLeft + (replacePending ? 0 : pending) + distance, track.scrollWidth - track.clientWidth));
      pending = target - track.scrollLeft;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || !track.clientWidth) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (!delta) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      // Return vertical scrolling to the page at either end of the gallery.
      if (maxScroll <= 1 || (delta < 0 && track.scrollLeft <= 1) ||
          (delta > 0 && track.scrollLeft >= maxScroll - 1)) return;
      event.preventDefault();
      moveRef.current(delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? track.clientWidth : 1));
    };
    const resize = new ResizeObserver(() => {
      pending = 0;
    });
    resize.observe(track);
    track.addEventListener("wheel", wheel, { passive: false });
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      track.removeEventListener("wheel", wheel);
      moveRef.current = () => {};
    };
  }, [images.length]);

  if (!images.length) return null;

  return (
    <div
      ref={trackRef}
      role="region"
      aria-label="Project images. Scroll or use left and right arrow keys to browse."
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const step = (event.currentTarget.firstElementChild as HTMLElement).offsetWidth + 12;
        moveRef.current(event.key === "ArrowRight" ? step : -step);
      }}
      onScroll={(event) => {
        const track = event.currentTarget;
        const cards = Array.from(track.querySelectorAll<HTMLElement>("button"));
        onIndexChange(Math.max(0, cards.findLastIndex((card) => card.offsetLeft <= track.scrollLeft + 1)));
      }}
      className="relative hidden gap-3 overflow-x-hidden [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-white md:flex"
    >
      {images.map((image, index) => {
        return (
          <button
            key={image.key}
            type="button"
            aria-label={`Expand ${image.category.toLowerCase()} ${image.kind} ${index + 1}`}
            onClick={() => onSelect(index)}
            className={`group relative shrink-0 overflow-hidden bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white ${images.length === 1 ? "aspect-[16/10] w-full" : "aspect-[0.77/1] w-[calc(25%_-_9px)]"}`}
          >
            <Image src={image.src} alt={image.alt} fill sizes={images.length === 1 ? "86vw" : "22vw"} className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
          </button>
        );
      })}
      {/* Leave enough room for even the final image to align with the left edge. */}
      {images.length > 1 ? (
        <div aria-hidden="true" className="shrink-0 basis-[calc(75%_-_3px)]" />
      ) : null}
    </div>
  );
}
