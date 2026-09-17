import type { Metadata } from "next";

import CultureOverviewSection from "@/components/culture/CultureOverviewSection";
import CulturePrinciplesSection from "@/components/culture/CulturePrinciplesSection";
import ClosingCallout from "@/components/shared/ClosingCallout";

export const metadata: Metadata = {
  title: "Culture | ECAD Architects",
  description:
    "Discover the culture, people, and values behind ECAD Architects.",
};

export default function CulturePage() {
  return (
    <main className="flex-1 bg-white">
      <section
        aria-label="ECAD Architects culture"
        className="wide-screen-gutter px-[clamp(1.25rem,3vw,3rem)] pt-[clamp(0.5rem,1.1vw,1rem)]"
      >
        <div className="relative aspect-[2.34/1] w-full overflow-hidden bg-[#d8d5ce] mt-5">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label="ECAD Design Architects culture film"
            className="size-full object-cover object-center"
          >
            <source src="/culture-hero.mp4" type="video/mp4" />
            Your browser does not support the video element.
          </video>
        </div>
      </section>

      <CultureOverviewSection />
      <CulturePrinciplesSection />
      <ClosingCallout />
    </main>
  );
}
