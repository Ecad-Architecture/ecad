"use client";

import { useEffect, useRef, useState } from "react";

export default function PageScrollbar() {
  const [metrics, setMetrics] = useState({ top: 0, height: 0, max: 0, position: 0, visible: false });
  const drag = useRef<{ y: number; scroll: number } | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    const measure = () => {
      frame = 0;
      const viewport = root.clientHeight;
      const max = Math.max(0, root.scrollHeight - viewport);
      const height = Math.min(viewport, Math.max(48, viewport * viewport / root.scrollHeight));
      const position = Math.max(0, Math.min(max, window.scrollY));
      const locked = [document.body, root].some((element) =>
        ["hidden", "clip"].includes(getComputedStyle(element).overflowY),
      );
      const enabled = media.matches && !window.matchMedia("(forced-colors: active)").matches;
      root.toggleAttribute("data-overlay-scrollbar", enabled);
      setMetrics({
        top: max ? position / max * (viewport - height) : 0,
        height,
        max,
        position,
        visible: enabled && max > 0 && !locked,
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);
    resizeObserver.observe(root);
    const mutationObserver = new MutationObserver(schedule);
    mutationObserver.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] });
    mutationObserver.observe(root, { attributes: true, attributeFilter: ["style", "class", "data-ecad-intro"] });
    const contrast = window.matchMedia("(forced-colors: active)");
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    contrast.addEventListener("change", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
      contrast.removeEventListener("change", schedule);
      root.removeAttribute("data-overlay-scrollbar");
    };
  }, []);

  if (!metrics.visible) return null;

  return (
    <div
      role="scrollbar"
      aria-label="Scroll page"
      aria-controls="top"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={Math.round(metrics.max)}
      aria-valuenow={Math.round(metrics.position)}
      tabIndex={0}
      className="page-scrollbar group fixed right-0 top-0 z-[80] w-4 touch-none select-none outline-none"
      style={{ height: metrics.height, transform: `translateY(${metrics.top}px)` }}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.focus({ preventScroll: true });
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { y: event.clientY, scroll: window.scrollY };
      }}
      onPointerMove={(event) => {
        if (!drag.current) return;
        const travel = document.documentElement.clientHeight - metrics.height;
        if (travel <= 0) return;
        window.scrollTo({
          top: drag.current.scroll + (event.clientY - drag.current.y) / travel * metrics.max,
          behavior: "instant",
        });
      }}
      onPointerUp={(event) => {
        drag.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      }}
      onPointerCancel={() => { drag.current = null; }}
      onLostPointerCapture={() => { drag.current = null; }}
      onKeyDown={(event) => {
        const page = document.documentElement.clientHeight * 0.9;
        const offsets: Record<string, number> = {
          ArrowUp: -40, ArrowDown: 40, PageUp: -page, PageDown: page,
          Home: -metrics.max, End: metrics.max,
          " ": event.shiftKey ? -page : page,
        };
        if (!(event.key in offsets)) return;
        event.preventDefault();
        window.scrollBy({ top: offsets[event.key], behavior: "instant" });
      }}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-1.5 w-1 rounded-full bg-[linear-gradient(to_bottom,transparent_20%,rgb(255_246_132_/_40%)_45%,rgb(255_246_132_/_40%)_55%,transparent_80%)] group-focus-visible:brightness-200" />
    </div>
  );
}
