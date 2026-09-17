import type { Metadata } from "next";
import Image from "next/image";

import ClosingCallout from "@/components/shared/ClosingCallout";
import StaffGrid from "@/components/team/StaffGrid";

export const metadata: Metadata = {
  title: "Team | ECAD Architects",
  description:
    "Meet the people whose experience, curiosity, and collaboration shape ECAD Architects.",
};

export default function TeamPage() {
  return (
    <main className="flex-1 bg-white">
      <section
        aria-label="ECAD Architects team"
        className="wide-screen-gutter px-[clamp(1.25rem,3vw,3rem)] pb-[clamp(1.75rem,4vw,3rem)] pt-[clamp(0.5rem,1.1vw,1rem)]"
      >
        <div className="relative aspect-[2.34/1] w-full overflow-hidden bg-[#d8d5ce]">
          <Image
            src="/project-detail-hero.jpg"
            alt="Contemporary ECAD-designed residential development framed by mature trees"
            fill
            sizes="100vw"
            className="object-cover object-center"
            preload
          />
        </div>
      </section>

      <div className="relative isolate overflow-hidden bg-linear-to-b from-[#1D2920] via-[#1D2920] to-[#1B1D0A]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[58%] bg-cover bg-center bg-no-repeat opacity-80"
          style={{
            backgroundImage: "url('/team-green-gradient.svg')",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 24%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 24%, black 100%)",
          }}
        />
        <div className="relative z-10">
          <StaffGrid />
          <ClosingCallout
            title="Build What Comes Next."
            description="ECAD Is Shaped By People Who Are Curious, Collaborative And Committed To Making Architecture That Matters. If You Want To Grow, Contribute, And Help Shape The Practice Of The Future, We'd Love To Hear From You."
            linkLabel="Explore Careers"
            href="/contact?form=practice#contact-form"
            tone="dark"
            contentTone="dark"
            className="!bg-transparent !pt-0"
          />
        </div>
      </div>
    </main>
  );
}
