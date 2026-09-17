import Image from "next/image";

import type { ProjectDetail } from "./types";

interface ProjectDetailHeroProps {
  project: ProjectDetail;
}

export default function ProjectDetailHero({
  project,
}: ProjectDetailHeroProps) {
  return (
    <section
      aria-labelledby="project-title"
      className="relative isolate h-svh min-h-[34rem] overflow-hidden bg-[#8d908d] text-white"
    >
      <div
        data-project-hero={project.slug}
        className="absolute inset-0 overflow-hidden"
      >
        {project.heroVideoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={project.heroSrc}
            aria-label={project.heroAlt}
            className="size-full object-cover object-center"
          >
            <source src={project.heroVideoUrl} />
          </video>
        ) : (
          <Image
            src={project.heroSrc}
            alt={project.heroAlt}
            fill
            sizes="100vw"
            className="object-cover object-center"
            preload
          />
        )}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,transparent_40%,transparent_58%,rgba(0,0,0,0.3)_100%)]"
      />

      <div className="wide-screen-max wide-screen-gutter absolute inset-x-0 bottom-[clamp(3rem,9vh,6.25rem)] z-10 mx-auto w-full max-w-[1600px] px-5 md:px-8 lg:px-[6.8vw]">
        <h1
          id="project-title"
          className="wide-screen-title max-w-[90vw] text-[30px] md:text-[clamp(2.4rem,4.15vw,4.25rem)] font-normal leading-[0.95] tracking-[-0.045em] drop-shadow-sm"
        >
          {project.title}
        </h1>
      </div>
    </section>
  );
}
