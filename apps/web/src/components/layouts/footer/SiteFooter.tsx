"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import SocialLinks from "./SocialLinks";

const footerNavigation = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Culture", href: "/culture" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
] as const;

export type SiteFooterProps = Record<string, never>;

export default function SiteFooter() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const isWorkIndex = pathname === "/work";
  const isTeamRoute = pathname === "/team";
  const isContactRoute = pathname === "/contact";
  const usesDarkFooter = isWorkIndex || isTeamRoute || isContactRoute;
  const workFooterBackground = isWorkIndex
    ? {
        backgroundColor: "#232323",
        backgroundImage: "url('/work-black-gradient.svg')",
        backgroundPosition: "left bottom",
        backgroundRepeat: "no-repeat",
        backgroundSize: "min(93vw, 1062px) auto",
      }
    : undefined;
  const teamFooterBackground = isTeamRoute
    ? {
        backgroundColor: "#1B1D0A",
        backgroundImage: "url('/team-green-gradient.svg')",
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }
    : undefined;

  return (
    <footer
      className={`wide-screen-footer wide-screen-gutter px-[clamp(1rem,2.5vw,2.75rem)] pb-5 ${
        usesDarkFooter
          ? "bg-[#202120] text-white"
          : "bg-white text-[#161916]"
      }`}
      style={workFooterBackground ?? teamFooterBackground}
    >
      <div
        className={`wide-screen-max wide-screen-flush mx-auto grid  w-full max-w-[1600px] gap-6 border-b px-[clamp(1rem,2.3vw,2.5rem)] py-4 leading-none tracking-[-0.02em] md:grid-cols-[1fr_auto] md:items-end md:gap-8 md:py-3 ${
          usesDarkFooter ? "border-white/35" : "border-[#1A7B34]"
        }`}
      >
        <div
          className={`wide-screen-caption order-2 flex flex-wrap items-center gap-x-[clamp(1rem,2vw,1.5rem)] gap-y-3 text-[10px] md:order-1 md:pb-0.5 ${
            usesDarkFooter ? "text-white/65" : "text-[#1A7B34]"
          }`}
        >
          <p className="shrink-0">&copy; {currentYear} ECAD DESIGN ARCHITECTS</p>
          <Link
            href="/privacy-policy"
            className="transition-opacity hover:opacity-55 focus-visible:rounded-sm focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-current"
          >
            Privacy Policy
          </Link>
        </div>

        <div className="wide-screen-footer-actions wide-screen-label order-1 flex flex-col items-start gap-4 text-[12px] md:order-2 md:items-end">
          <SocialLinks tone={usesDarkFooter ? "white" : "green"} />

          <nav aria-label="Footer navigation">
            <ul className="flex list-none flex-wrap items-center gap-x-[clamp(1rem,2.2vw,2rem)] gap-y-3">
              {footerNavigation.map((item) => {
                const isCurrent =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isCurrent ? "page" : undefined}
                      className={`transition-opacity hover:opacity-55 focus-visible:rounded-sm focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-current ${
                        isCurrent
                          ? "wide-screen-wordmark font-semibold text-[#1A7B34]"
                          : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
