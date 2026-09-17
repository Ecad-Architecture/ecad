import Image from "next/image";
import Link from "next/link";

const workHeaderNavigation = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Culture", href: "/culture" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
] as const;

interface WorkIndexHeaderNavigationProps {
  activeHref?: (typeof workHeaderNavigation)[number]["href"];
  iconSrc?: string;
  tone?: "dark" | "light";
}

export default function WorkIndexHeaderNavigation({
  activeHref = "/work",
  iconSrc = "/header-logo-icon-green.svg",
  tone = "light",
}: WorkIndexHeaderNavigationProps) {
  const baseTextColor = tone === "dark" ? "text-[#1D2921]" : "text-white";
  const focusColor =
    tone === "dark" ? "focus-visible:outline-[#1D2921]" : "focus-visible:outline-white";
  const activeLinkColor =
    `text-[#14843b] after:absolute after:inset-x-0 after:bottom-0 after:h-px ${
      tone === "dark" ? "after:bg-[#14843b]" : "after:bg-brand-yellow"
    }`;

  return (
    <div className="hidden w-full items-center justify-between md:flex">
      <Link
        href="/"
        aria-label="ECAD Design Architects home"
        className="wide-screen-wordmark rounded-sm text-[11px] font-semibold leading-none tracking-[-0.035em] text-[#1A7B34] transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1A7B34] lg:text-[13px]"
      >
        ECAD DESIGN ARCHITECTS
      </Link>

      <div className="flex items-center gap-[clamp(2rem,3.7vw,4rem)]">
        <nav aria-label="Primary navigation">
          <ul className="flex list-none items-center gap-[clamp(1.4rem,2.3vw,2.5rem)]">
            {workHeaderNavigation.map((item) => {
              const isCurrent = item.href === activeHref;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`wide-screen-nav relative inline-block px-3 py-1 text-center text-[13px] font-medium leading-none tracking-[-0.02em] transition-opacity hover:opacity-75 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 ${focusColor} ${
                      isCurrent ? activeLinkColor : baseTextColor
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link
          href="/"
          aria-label="ECAD Design Architects home"
          className="inline-flex rounded-sm transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1A7B34]"
        >
          <Image
            src={iconSrc}
            alt=""
            width={25}
            height={25}
            className="wide-screen-nav-icon my-auto h-[22px] w-[22px]"
            unoptimized
          />
        </Link>
      </div>
    </div>
  );
}
