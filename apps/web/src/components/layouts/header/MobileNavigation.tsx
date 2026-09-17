"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import MenuIcon from "./MenuIcon";
import NavigationLink from "./NavigationLink";
import { mainNavigation } from "./navigation";

interface MobileNavigationProps {
  tone: "light" | "dark";
}

export default function MobileNavigation({ tone }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const usesDarkPanel = pathname === "/culture" || pathname === "/team";
  const navigationItems =
    pathname === "/"
      ? mainNavigation
      : [{ href: "/", label: "Home" }, ...mainNavigation];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <div className="ml-auto md:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        className={`relative z-10 flex size-10 items-center justify-end rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${tone === "light" ? "text-white" : "text-[#333333]"}`}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <MenuIcon isOpen={isOpen} />
      </button>

      <div
        id="mobile-navigation"
        aria-hidden={!isOpen}
        className={`fixed inset-x-0 top-[var(--header-height)] z-0 grid overflow-hidden ${usesDarkPanel ? "bg-[#333333] text-white" : "bg-white text-black"} transition-[grid-template-rows,visibility] duration-300 ${
          isOpen
            ? "visible grid-rows-[1fr] border-t border-black/10"
            : "invisible grid-rows-[0fr]"
        }`}
      >
        <nav aria-label="Mobile navigation" className="min-h-0 overflow-hidden">
          <ul className="flex list-none flex-col gap-7 px-5 py-8">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <NavigationLink
                  {...item}
                  onNavigate={() => setIsOpen(false)}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
