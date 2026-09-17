export interface NavigationItem {
  href: string;
  label: string;
}

export const mainNavigation = [
  { href: "/work", label: "Work" },
  { href: "/culture", label: "Culture" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
] as const satisfies readonly NavigationItem[];
