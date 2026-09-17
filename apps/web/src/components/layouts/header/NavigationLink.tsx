import Link from "next/link";

import type { NavigationItem } from "./navigation";

interface NavigationLinkProps extends NavigationItem {
  onNavigate?: () => void;
}

export default function NavigationLink({
  href,
  label,
  onNavigate,
}: NavigationLinkProps) {
  return (
    <Link
      href={href}
      className="group relative inline-flex py-1 text-[13px] font-medium leading-none tracking-[-0.01em]"
      onClick={onNavigate}
    >
      {label}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100"
      />
    </Link>
  );
}
