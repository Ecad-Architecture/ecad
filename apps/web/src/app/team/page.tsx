import type { Metadata } from "next";
import Image from "next/image";

import ClosingCallout from "@/components/shared/ClosingCallout";
import StaffGrid from "@/components/team/StaffGrid";
import { getTeamMembers, getTeamPageData } from "@/sanity/data/team";

export const metadata: Metadata = {
  title: "Team | ECAD Architects",
  description:
    "Meet the people whose experience, curiosity, and collaboration shape ECAD Architects.",
};

export default async function TeamPage() {
  const [{ currentMembers, formerMembers }, pageData] = await Promise.all([
    getTeamMembers(),
    getTeamPageData(),
  ]);

  return (
    <main className="flex-1 bg-white">
      <section
        aria-label="Team hero"
        className="wide-screen-gutter px-[clamp(1.25rem,6.8vw,7rem)] pt-[clamp(2.5rem,7.5vw,8.1rem)]"
      >
        <div className="relative aspect-[2.34/1] w-full overflow-hidden bg-[#d8d5ce]">
          {pageData?.heroUrl && (
            <Image
              src={pageData.heroUrl}
              alt={pageData.heroAlt || "Team Hero Image"}
              fill
              sizes="100vw"
              className="object-cover object-center"
              preload
            />
          )}
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
          <StaffGrid currentMembers={currentMembers} formerMembers={formerMembers} />
          <ClosingCallout
            title={pageData?.callToAction?.title || ""}
            description={pageData?.callToAction?.description || ""}
            linkLabel={pageData?.callToAction?.label || ""}
            href={pageData?.callToAction?.href || "#"}
            backgroundImage={
              pageData?.callToAction?.backgroundUrl
                ? { src: pageData.callToAction.backgroundUrl, alt: pageData.callToAction.backgroundAlt || "" }
                : undefined
            }
            insetImage={
              pageData?.callToAction?.insetUrl
                ? { src: pageData.callToAction.insetUrl, alt: pageData.callToAction.insetAlt || "" }
                : undefined
            }
            tone="dark"
            contentTone="dark"
            className="!bg-transparent !pt-0"
          />
        </div>
      </div>
    </main>
  );
}
