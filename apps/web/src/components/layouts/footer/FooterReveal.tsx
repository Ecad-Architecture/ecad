import type { ReactNode } from "react";

interface FooterRevealProps {
  children: ReactNode;
}

export default function FooterReveal({ children }: FooterRevealProps) {
  return (
    <div id="footer-reveal" className="relative z-10 bg-white">
      {children}
    </div>
  );
}
