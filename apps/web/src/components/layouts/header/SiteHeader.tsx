"use client";

import { REDUCE_SITE_MOTION as prefersReducedMotion } from "@/motion";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";

import { MOTION_DURATION, SMOOTH_EASE } from "@/motion";

import HomeBrandMark from "./HomeBrandMark";
import MobileNavigation from "./MobileNavigation";
import styles from "./SiteHeader.module.css";
import WorkIndexHeaderNavigation from "./WorkIndexHeaderNavigation";

export interface SiteHeaderProps {
  logo?: StaticImageData | string;
}

export default function SiteHeader({
  logo = "/ecad-full-logo-home.svg",
}: SiteHeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isCultureRoute = pathname === "/culture";
  const isTeamRoute = pathname === "/team";
  const isContactRoute = pathname === "/contact";
  const isWorkIndex = pathname === "/work";
  const isWorkDetail = pathname.startsWith("/work/");
  const isWorkRoute = isWorkIndex || isWorkDetail;
  const usesDarkTextNavigation = isCultureRoute || isTeamRoute;
  const usesImageBackdrop = isHome || isWorkRoute || isContactRoute;
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { scrollY } = useScroll();
  const usesLightMobileNavigation =
    isWorkRoute || isContactRoute || (isHome && !hasScrolled);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const scrolled = latest > 8;
    setHasScrolled((current) => (current === scrolled ? current : scrolled));
  });

  useEffect(() => {
    const footerReveal = document.getElementById("footer-reveal");

    if (!footerReveal) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCollapsedContact =
          isContactRoute &&
          document
            .getElementById("contact-form")
            ?.getAttribute("data-expanded") === "false";

        setIsFooterVisible(
          !isCollapsedContact && entry.intersectionRatio > 0,
        );
      },
      { threshold: [0, 0.01] },
    );

    observer.observe(footerReveal);
    return () => observer.disconnect();
  }, [isContactRoute]);

  return (
    <>
      <header
        aria-hidden={isFooterVisible}
        inert={isFooterVisible}
        className={`${styles.navbar} fixed inset-x-0 top-0 z-50 h-[var(--header-height)] transition-[background-color,backdrop-filter,color,opacity,transform] duration-500 ease-out wide-screen-home-header
          
          ${
          isWorkRoute || isContactRoute
            ? "bg-white/[0.08] text-white backdrop-blur-[10px]"
            : usesDarkTextNavigation
              ? `${hasScrolled ? "bg-white/90" : "bg-white/[0.72]"} text-[#1D2921] backdrop-blur-[10px]`
            : hasScrolled
              ? "bg-white/90 text-black backdrop-blur-md"
            : isHome
              ? "bg-transparent text-black backdrop-blur-none"
            : usesImageBackdrop
              ? "bg-transparent text-white backdrop-blur-none"
              : "bg-white text-black backdrop-blur-none"
        } ${
          isFooterVisible
            ? "pointer-events-none -translate-y-3 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        {isHome && !hasScrolled && (
          <div
            aria-hidden="true"
            className={styles.homeFrostedBackdrop}
          />
        )}
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={pathname}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : MOTION_DURATION.header,
              ease: SMOOTH_EASE,
            }}
            className={`wide-screen-max wide-screen-gutter relative z-10 mx-auto flex h-full w-full max-w-[1600px] items-center justify-between px-5 md:px-8 lg:px-[6.8vw] ${isHome ? "wide-screen-home-header-content" : ""}`}
          >
          <Link
            href="/"
            aria-label="ECAD Design Architects home"
            className="inline-flex shrink-0 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 md:hidden"
          >
            <Image
              src={usesLightMobileNavigation ? "/ecad-full-logo-home.svg" : "/ecad-full-logo-dark.svg"}
              alt=""
              width={96}
              height={21}
              className={`h-auto ${isHome ? "w-[80px]" : "w-[53px]"}`}
              preload
              unoptimized
            />
          </Link>
          {isWorkRoute || usesDarkTextNavigation || isContactRoute ? (
            <WorkIndexHeaderNavigation
              activeHref={
                isContactRoute
                  ? "/contact"
                  : isTeamRoute
                    ? "/team"
                    : isCultureRoute
                      ? "/culture"
                      : "/work"
              }
              iconSrc="/header-logo-icon-green.svg"
              tone={usesDarkTextNavigation ? "dark" : "light"}
            />
          ) : (
            <>
          <nav aria-label="Primary navigation" className={`hidden md:block ${isHome ? "wide-screen-home-nav-container text-white" : ""}`}>
            <ul className={`flex list-none items-center gap-[clamp(3rem,12vw,12rem)] ${isHome ? "wide-screen-home-nav-list" : ""}`}>
              <li>
                <Link
                  href="/work"
                  aria-current={isWorkRoute ? "page" : undefined}
                  className={`wide-screen-nav ${isHome ? "wide-screen-home-nav text-left font-normal" : "text-center font-medium"} relative inline-block w-20 py-2 text-[13px] transition-opacity hover:opacity-70 ${
                    isWorkRoute
                      ? "text-[#14843b] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-brand-yellow"
                      : ""
                  }`}
                >
                  Work
                </Link>
              </li>
              <li>
                <Link
                  href="/culture"
                  aria-current={isCultureRoute ? "page" : undefined}
                  className={`wide-screen-nav ${isHome ? "wide-screen-home-nav font-normal" : "font-medium"} relative inline-block w-20 py-2 text-center text-[13px] transition-opacity hover:opacity-70 ${
                    isCultureRoute
                      ? "text-[#14843b] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-brand-yellow"
                      : ""
                  }`}
                >
                  Culture
                </Link>
              </li>
            </ul>
          </nav>
          {isWorkRoute || isCultureRoute || isTeamRoute || isContactRoute ? (
            <Link
              href="/"
              aria-label="ECAD Design Architects home"
              className={`absolute left-1/2 top-1/2 z-10 inline-flex -translate-x-1/2 -translate-y-1/2 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 ${
                isWorkRoute
                  ? "focus-visible:outline-white"
                  : "focus-visible:outline-black"
              }`}
            >
              <Image
                src={
                  isWorkRoute
                    ? "/ecad-full-logo-white.svg"
                    : "/ecad-full-logo-dark.svg"
                }
                alt=""
                width={96}
                height={21}
                className="h-auto w-[53px]"
                preload
                unoptimized
              />
            </Link>
          ) : (
            <HomeBrandMark logo={logo} />
          )}
          <nav aria-label="Secondary navigation" className={`hidden md:block ${isHome ? "wide-screen-home-nav-container" : ""}`}>
            <ul className={`flex list-none items-center gap-[clamp(3rem,12vw,12rem)] ${isHome ? "wide-screen-home-nav-list text-white" : ""}`}>
              <li>
                <Link
                  href="/team"
                  aria-current={isTeamRoute ? "page" : undefined}
                  className={`wide-screen-nav ${isHome ? "wide-screen-home-nav font-normal" : "font-medium"} relative inline-block w-20 py-2 text-center text-[13px] transition-opacity hover:opacity-70 ${
                    isTeamRoute
                      ? "text-[#14843b] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-brand-yellow"
                      : ""
                  }`}
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  aria-current={isContactRoute ? "page" : undefined}
                  className={`wide-screen-nav ${isHome ? "wide-screen-home-nav text-right font-normal" : "text-center font-medium"} relative inline-block w-20 py-2 text-[13px] transition-opacity hover:opacity-70 ${
                    isContactRoute
                      ? "text-[#14843b] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-brand-yellow"
                      : ""
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
            </>
          )}
          <MobileNavigation
            tone={usesLightMobileNavigation ? "light" : "dark"}
          />
          </motion.div>
        </AnimatePresence>
      </header>
      <div
        aria-hidden="true"
        className={
          usesImageBackdrop
            ? "hidden"
            : "h-[var(--header-height)] shrink-0"
        }
      />
    </>
  );
}
