"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type MouseEvent, useRef, useState } from "react";

import { useProjectTransition } from "./ProjectTransitionProvider";
import { getPaginationItems } from "./pagination";
import type { WorkProject } from "./types";

interface ProjectNavigationProps {
  projects: readonly WorkProject[];
}

const PROJECTS_PER_PAGE = 4;

function RelatedProjectCard({ project }: { project: WorkProject }) {
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { startProjectTransition } = useProjectTransition();
  const href = `/work/${project.slug}`;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!imageFrameRef.current) {
      return;
    }

    startProjectTransition(event, {
      alt: project.imageAlt,
      href,
      imageElement: imageFrameRef.current,
      imageSrc: project.imageSrc,
      slug: project.slug,
    });
  };

  return (
    <article className="min-w-0">
      <Link
        href={href}
        data-project-transition
        onPointerEnter={() => router.prefetch(href)}
        onFocus={() => router.prefetch(href)}
        onClick={handleClick}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16843a]"
      >
        <div
          ref={imageFrameRef}
          className="relative aspect-[2.5/1] overflow-hidden bg-black/5"
        >
          <Image
            src={project.imageSrc}
            alt={project.imageAlt}
            fill
            sizes="(min-width: 768px) 22vw, (min-width: 640px) 44vw, 100vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025] group-focus-visible:scale-[1.025]"
          />
        </div>

        <div className="pt-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="wide-screen-label text-[12px] font-semibold leading-tight tracking-[-0.025em] text-[#151915]">
              <span className="min-[120rem]:font-medium">
                {project.title}
              </span>
            </h3>
          </div>
          <p className="wide-screen-caption mt-2 line-clamp-2 text-[10px] leading-[1.45] tracking-[-0.015em] text-[#151915]/75">
            {project.description}
          </p>
          <dl className="wide-screen-micro mt-2 flex flex-wrap gap-x-5 gap-y-2 text-[8px] leading-tight text-[#151915] md:text-[9px]">
            <div className="flex gap-2">
              <dt className="text-black/45">Location</dt>
              <dd>{project.location}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-black/45">Typology</dt>
              <dd>{project.category}</dd>
            </div>
          </dl>
        </div>
      </Link>
    </article>
  );
}

export default function ProjectNavigation({
  projects,
}: ProjectNavigationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(projects.length / PROJECTS_PER_PAGE),
  );
  const visibleProjects = projects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE,
  );

  return (
    <section
      aria-labelledby="explore-more-title"
      className="bg-white text-[#151915]"
    >
      <div className="wide-screen-max wide-screen-gutter mx-auto w-full max-w-[1600px] px-5 pb-8 pt-12 md:px-[6.8vw] md:pb-8 md:pt-[clamp(5rem,9vw,9rem)]">
        <h2
          id="explore-more-title"
          className="text-[16px] font-semibold leading-tight tracking-[-0.025em]"
        >
          Explore <span className="text-[#16843a]">More</span>
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-x-3 gap-y-8 sm:grid-cols-2 md:grid-cols-4">
          {visibleProjects.map((relatedProject) => (
            <RelatedProjectCard
              key={relatedProject.slug}
              project={relatedProject}
            />
          ))}
        </div>

        <nav
          aria-label="Related projects pagination"
          className="mt-8 flex items-center justify-end gap-5 md:gap-5"
        >
          {getPaginationItems(currentPage, totalPages).map(
            (page) => typeof page === "string" ? (
              <span
                key={page}
                aria-hidden="true"
                className="wide-screen-body-sm py-2 text-[12px] text-black/45"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                aria-current={page === currentPage ? "page" : undefined}
                aria-label={`Show related projects page ${page}`}
                onClick={() => setCurrentPage(page)}
                className={`wide-screen-body-sm relative py-2 text-[12px] tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${
                  page === currentPage
                    ? "text-[#16843a]"
                    : "text-black/45 hover:text-black"
                }`}
              >
                {String(page).padStart(2, "0")}
              </button>
            ),
          )}

          <button
            type="button"
            aria-label={
              currentPage === totalPages
                ? "Return to first related-projects page"
                : "Show next related-projects page"
            }
            onClick={() =>
              setCurrentPage(currentPage === totalPages ? 1 : currentPage + 1)
            }
            className="ml-2 rounded-full transition-opacity hover:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black md:ml-4"
          >
            <Image
              src="/work-pagination-next.svg"
              alt=""
              width={35}
              height={35}
              className="size-10 invert md:size-[35px]"
              unoptimized
            />
          </button>
        </nav>


      </div>
    </section>
  );
}
