interface MenuIconProps {
  isOpen: boolean;
}

export default function MenuIcon({ isOpen }: MenuIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-6 overflow-visible"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
    >
      <path
        d="M3 7h18"
        className={`origin-center transition-transform duration-300 ${
          isOpen ? "translate-y-[5px] rotate-45" : ""
        }`}
      />
      <path
        d="M3 12h18"
        className={`transition-opacity duration-200 ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
      />
      <path
        d="M3 17h18"
        className={`origin-center transition-transform duration-300 ${
          isOpen ? "-translate-y-[5px] -rotate-45" : ""
        }`}
      />
    </svg>
  );
}
