"use client";

import { REDUCE_SITE_MOTION as shouldReduceMotion } from "@/motion";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { useProjectTransition } from "./ProjectTransitionProvider";
import type { WorkProject } from "./types";

type ActiveCategory = string;
type SortOrder = "featured" | "name-asc" | "name-desc";
type ViewMode = "grid" | "curated";

interface SelectOption {
  label: string;
  value: string;
}

const ROTATION_INTERVAL = 5000;
const PROJECTS_PER_SECTION = 5;
const SECTIONS_PER_PAGE = 3;
const CURATED_PROJECTS_PER_PAGE = PROJECTS_PER_SECTION * SECTIONS_PER_PAGE;
const GRID_PROJECTS_PER_PAGE = 8;

function ViewIcon({ src }: { src: string }) {
  return (
    <span
      aria-hidden="true"
      className="block size-4 shrink-0 bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
      style={{
        maskImage: `url('${src}')`,
        WebkitMaskImage: `url('${src}')`,
        WebkitMaskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
      }}
    />
  );
}

function WorkSelect({
  ariaLabel,
  onChange,
  options,
  value,
}: {
  ariaLabel: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  value: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const selectedOption = options[selectedIndex];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnOutsidePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const closeOnOutsideFocus = (event: FocusEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointerDown);
    document.addEventListener("focusin", closeOnOutsideFocus);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointerDown);
      document.removeEventListener("focusin", closeOnOutsideFocus);
    };
  }, [isOpen]);

  const focusOption = (index: number) => {
    setHighlightedIndex(index);
    optionRefs.current[index]?.focus();
  };

  const openDropdown = (index = selectedIndex) => {
    setHighlightedIndex(index);
    setIsOpen(true);
    window.requestAnimationFrame(() => optionRefs.current[index]?.focus());
  };

  const selectOption = (index: number) => {
    onChange(options[index].value);
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openDropdown(selectedIndex);
    }
  };

  const handleOptionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOption((index + 1) % options.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOption((index - 1 + options.length) % options.length);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focusOption(event.key === "Home" ? 0 : options.length - 1);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex min-w-0 items-center border-t border-white/45 transition-colors focus-within:border-white hover:border-white ${
        isOpen ? "z-40" : ""
      }`}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() =>
          isOpen ? setIsOpen(false) : openDropdown(selectedIndex)
        }
        onKeyDown={handleTriggerKeyDown}
        className="wide-screen-label h-11 w-full cursor-pointer bg-transparent pl-6 pr-3 text-left text-[11px] text-white outline-none md:text-xs"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center"
        >
          <Image
            src="/work-filter-plus.svg"
            alt=""
            width={16}
            height={16}
            className={`size-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-45" : ""
            }`}
            unoptimized
          />
        </span>
        {selectedOption.label}
      </button>

      {isOpen ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 right-0 top-[calc(100%+0.375rem)] max-h-80 overflow-y-auto rounded-[8px] border border-white/20 bg-[#232323] p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] shadow-[0_14px_35px_rgba(0,0,0,0.3)] [&::-webkit-scrollbar]:hidden"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;

            return (
              <li key={option.value} role="presentation">
                <button
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={isHighlighted ? 0 : -1}
                  onClick={() => selectOption(index)}
                  onFocus={() => setHighlightedIndex(index)}
                  onPointerEnter={() => setHighlightedIndex(index)}
                  onKeyDown={(event) => handleOptionKeyDown(event, index)}
                  className={`wide-screen-label block w-full rounded-[5px] px-5 py-3 text-left text-[11px] leading-tight outline-none transition-colors md:text-xs ${
                    isSelected || isHighlighted
                      ? "bg-[#1A7B34] text-[#FFF684]"
                      : "text-white hover:bg-[#1A7B34] hover:text-[#FFF684] focus-visible:bg-[#1A7B34] focus-visible:text-[#FFF684]"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function useProjectNavigation(project: WorkProject) {
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

  return { handleClick, href, imageFrameRef, router };
}

function ProjectArrow() {
  return (
    <Image
      src="/work-project-arrow.svg"
      alt=""
      width={12}
      height={12}
      className="size-2.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:size-3"
      unoptimized
    />
  );
}

function CuratedProjectCard({
  featured,
  featuredSide,
  project,
}: {
  featured: boolean;
  featuredSide: "left" | "right";
  project: WorkProject;
}) {
  const { handleClick, href, imageFrameRef, router } =
    useProjectNavigation(project);

  return (
    <article
      className={`min-h-0 min-w-0 bg-[#232323] ${
        featured
          ? `lg:col-span-2 lg:row-span-2 ${
              featuredSide === "right" ? "lg:col-start-3" : "lg:col-start-1"
            }`
          : "lg:col-span-1 lg:row-span-1"
      }`}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={project.slug}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.9, ease: [0.42, 0, 1, 1] }}
          className="h-full"
        >
          <Link
            href={href}
            data-project-transition
            onPointerEnter={() => router.prefetch(href)}
            onFocus={() => router.prefetch(href)}
            onClick={handleClick}
            className="group flex h-full min-h-0 flex-col focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#20a34a]"
          >
            <div
              ref={imageFrameRef}
              className={`relative shrink-0 overflow-hidden bg-white/5 ${
                featured
                  ? "aspect-[1.45/1] lg:h-[70%] lg:w-full lg:aspect-auto"
                  : "aspect-[1.72/1] lg:h-[51%] lg:w-full lg:aspect-auto"
              }`}
            >
              <Image
                src={project.imageSrc}
                alt={project.imageAlt}
                fill
                sizes={
                  featured
                    ? "(min-width: 1024px) 50vw, 100vw"
                    : "(min-width: 1024px) 25vw, 100vw"
                }
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              />
            </div>

            <div
              className={`flex min-h-0 flex-1 flex-col ${
                featured
                  ? "px-3 py-4 md:px-4 md:py-5"
                  : "px-3 py-3 md:px-4 md:py-3.5"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="wide-screen-label text-[12px] font-semibold leading-tight tracking-[-0.025em] text-white md:text-[13px]">
                  <span className="min-[120rem]:font-medium">
                    {project.title}
                  </span>
                </h3>
                <ProjectArrow />
              </div>
              <p
                className={`wide-screen-caption mt-2 text-[10px] leading-[1.45] tracking-[-0.015em] text-white/78 md:text-[11px] ${
                  featured ? "max-w-[36rem]" : "line-clamp-2"
                }`}
              >
                {project.description}
              </p>
              <dl className="wide-screen-micro mt-auto hidden gap-x-5 pt-3 text-[8px] leading-tight text-white/80 sm:flex md:text-[9px]">
                <div className="flex gap-2">
                  <dt className="text-white/45">Location</dt>
                  <dd>{project.location}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-white/45">Status</dt>
                  <dd>{project.status}</dd>
                </div>
              </dl>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
    </article>
  );
}

function CuratedProjectGroup({
  featuredSide,
  projects,
  rotationOffset,
  sectionIndex,
}: {
  featuredSide: "left" | "right";
  projects: readonly WorkProject[];
  rotationOffset: number;
  sectionIndex: number;
}) {
  const orderedProjects = projects.map(
    (_, index) => projects[(rotationOffset + index) % projects.length],
  );

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-4 border-t border-white/20 px-2 py-5 sm:grid-cols-2 lg:grid-flow-dense lg:grid-cols-4 lg:grid-rows-2 lg:px-3 lg:py-6">
      {orderedProjects.map((project, index) => (
        <CuratedProjectCard
          key={`curated-section-${sectionIndex}-slot-${index}`}
          project={project}
          featured={index === 0}
          featuredSide={featuredSide}
        />
      ))}
    </div>
  );
}

function WorkPagination({
  currentPage,
  onPageChange,
  totalPages,
}: {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Projects pagination"
      className="wide-screen-gutter flex min-h-36 items-center justify-end px-5 md:px-8 lg:min-h-60 lg:items-start lg:px-[6.8vw] lg:pt-6"
    >
      <div className="flex items-center gap-5 md:gap-7">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              type="button"
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Go to projects page ${page}`}
              onClick={() => onPageChange(page)}
              className={`wide-screen-body-sm relative py-2 text-[10px] tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current md:text-[12px] ${
                page === currentPage
                  ? "text-[#20a34a] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-current"
                  : "text-white/65 hover:text-white"
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
              ? "Return to first projects page"
              : "Go to next projects page"
          }
          onClick={() =>
            onPageChange(currentPage === totalPages ? 1 : currentPage + 1)
          }
          className="ml-2 rounded-full transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <Image
            src="/work-pagination-next.svg"
            alt=""
            width={35}
            height={35}
            className="size-10 md:size-[35px]"
            unoptimized
          />
        </button>
      </div>
    </nav>
  );
}

function GridProjectCard({ project }: { project: WorkProject }) {
  const { handleClick, href, imageFrameRef, router } =
    useProjectNavigation(project);

  return (
    <article className="min-w-0 overflow-hidden bg-white/5">
      <Link
        href={href}
        data-project-transition
        onPointerEnter={() => router.prefetch(href)}
        onFocus={() => router.prefetch(href)}
        onClick={handleClick}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#20a34a]"
      >
        <div
          ref={imageFrameRef}
          className="relative aspect-[1.62/1] overflow-hidden bg-white/5"
        >
          <Image
            src={project.imageSrc}
            alt={project.imageAlt}
            fill
            sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f3f0e8]/85 px-5 text-center text-[#111711] opacity-0 transition-opacity duration-700 ease-in group-hover:opacity-100 group-focus-visible:opacity-100">
            <h3 className="wide-screen-body-md text-[clamp(1rem,1.45vw,1.4rem)] font-semibold leading-tight tracking-[-0.035em] text-[#16843a]">
              {project.title}
            </h3>
            <p className="wide-screen-body-sm mt-2 max-w-[14rem] text-[clamp(0.9rem,1.25vw,1.2rem)] leading-[1.2] tracking-[-0.03em]">
              {project.location}
            </p>
            <p className="wide-screen-body-sm mt-[clamp(1.2rem,2vw,2.25rem)] text-[clamp(0.9rem,1.2vw,1.15rem)] leading-none tracking-[-0.03em]">
              {project.year}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function WorkGallery({
  projects,
}: {
  projects: readonly WorkProject[];
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeCategory, setActiveCategory] =
    useState<ActiveCategory>("All");
  const [activeLocation, setActiveLocation] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [rotationOffset, setRotationOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const visibleProjects = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLocaleLowerCase();
    const matchingProjects = projects.filter((project) => {
      const matchesCategory =
        activeCategory === "All" || project.category === activeCategory;
      const matchesLocation =
        activeLocation === "all" || project.location === activeLocation;
      const matchesStatus =
        activeStatus === "all" ||
        project.status.toLocaleLowerCase() === activeStatus;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        `${project.title} ${project.location} ${project.category} ${project.description}`
          .toLocaleLowerCase()
          .includes(normalizedSearch);

      return (
        matchesCategory && matchesLocation && matchesStatus && matchesSearch
      );
    });

    if (sortOrder === "name-asc") {
      return matchingProjects.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortOrder === "name-desc") {
      return matchingProjects.sort((a, b) => b.title.localeCompare(a.title));
    }

    return matchingProjects;
  }, [activeCategory, activeLocation, activeStatus, projects, searchQuery, sortOrder]);

  const projectsPerPage =
    viewMode === "grid"
      ? GRID_PROJECTS_PER_PAGE
      : CURATED_PROJECTS_PER_PAGE;
  const totalPages = Math.max(
    1,
    Math.ceil(visibleProjects.length / projectsPerPage),
  );
  const pageProjects = visibleProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage,
  );
  const curatedSections = Array.from(
    { length: SECTIONS_PER_PAGE },
    (_, sectionIndex) =>
      pageProjects.slice(
        sectionIndex * PROJECTS_PER_SECTION,
        (sectionIndex + 1) * PROJECTS_PER_SECTION,
      ),
  ).filter((projects) => projects.length > 0);
  const rotationCycleLength = Math.max(
    1,
    ...curatedSections.map((projects) => projects.length),
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setRotationOffset(0);
    document.getElementById("work-gallery")?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (
      viewMode !== "curated" ||
      shouldReduceMotion ||
      rotationCycleLength < 2
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setRotationOffset(
        (current) =>
          (current - 1 + rotationCycleLength) % rotationCycleLength,
      );
    }, ROTATION_INTERVAL);

    return () => window.clearInterval(timer);
  }, [rotationCycleLength, viewMode]);

  const projectCategories = useMemo(
    () =>
      Array.from(new Set(projects.map((project) => project.category))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [projects],
  );
  const projectLocations = useMemo(
    () =>
      Array.from(new Set(projects.map((project) => project.location))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [projects],
  );
  const projectStatuses = useMemo(
    () =>
      Array.from(new Set(projects.map((project) => project.status))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [projects],
  );
  const typologyOptions: SelectOption[] = [
    { label: "Typology", value: "All" },
    ...projectCategories.map((category) => ({ label: category, value: category })),
  ];
  const locationOptions: SelectOption[] = [
    { label: "Location", value: "all" },
    ...projectLocations.map((location) => ({
      label: location,
      value: location,
    })),
  ];

  return (
    <section
      id="work-gallery"
      aria-labelledby="work-gallery-title"
      className="min-h-svh text-white"
      style={{
        backgroundColor: "#232323",
        backgroundImage: "url('/work-black-gradient.svg')",
        backgroundPosition: "left calc(100% + 80px)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "min(93vw, 1062px) auto",
      }}
    >
      <h2 id="work-gallery-title" className="sr-only">
        Explore ECAD projects
      </h2>

      <div
        className={`flex flex-col ${
          viewMode === "curated"
            ? "min-h-svh lg:h-svh lg:min-h-[48rem]"
            : ""
        }`}
      >
        <div className="wide-screen-max wide-screen-gutter mx-auto w-full max-w-[1600px] px-5 pb-12 pt-[clamp(2.75rem,8vh,5rem)] md:px-8 md:pb-16 lg:px-[6.8vw] lg:pb-[clamp(4rem,9vh,6rem)]">
        <div className="grid grid-cols-2 items-end gap-x-8 gap-y-7 lg:grid-cols-4 lg:gap-x-[clamp(3rem,8vw,8.5rem)]">
          <div className="flex items-center gap-10">
            <button
              type="button"
              aria-pressed={viewMode === "grid"}
              onClick={() => {
                setViewMode("grid");
                setCurrentPage(1);
                setRotationOffset(0);
              }}
              className={`wide-screen-label flex items-center gap-3 text-[11px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current md:text-xs ${
                viewMode === "grid"
                  ? "text-[#20a34a]"
                  : "text-white hover:text-white/70"
              }`}
            >
              <ViewIcon src="/work-grid-view.svg" />
              Grid View
            </button>
            {/* <button
              type="button"
              aria-pressed={viewMode === "curated"}
              onClick={() => {
                setViewMode("curated");
                setCurrentPage(1);
                setRotationOffset(0);
              }}
              className={`flex items-center gap-3 text-[11px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current md:text-xs ${
                viewMode === "curated"
                  ? "text-[#20a34a]"
                  : "text-white hover:text-white/70"
              }`}
            >
              <ViewIcon src="/work-curated-view.svg" />
              Curated View
            </button> */}
          </div>

          <label className="relative col-start-2 flex w-full items-center border-b border-white/60 pb-2 transition-colors focus-within:border-white lg:col-start-4">
            <span className="sr-only">Search projects</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setRotationOffset(0);
                setCurrentPage(1);
              }}
              placeholder="Search"
              className="wide-screen-label w-full bg-transparent pr-7 text-[11px] text-white outline-none placeholder:text-white md:text-xs"
            />
            <Image
              src="/work-search.svg"
              alt=""
              width={18}
              height={18}
              className="pointer-events-none absolute right-0 size-3.5"
              unoptimized
            />
          </label>
        </div>

        <div className="mt-[clamp(2.5rem,6vh,4.5rem)] grid grid-cols-2 gap-x-8 gap-y-5 lg:grid-cols-4 lg:gap-x-[clamp(3rem,8vw,8.5rem)]">
          <WorkSelect
            ariaLabel="Filter projects by typology"
            value={activeCategory}
            onChange={(value) => {
              setActiveCategory(value as ActiveCategory);
              setRotationOffset(0);
              setCurrentPage(1);
            }}
            options={typologyOptions}
          />
          <WorkSelect
            ariaLabel="Filter projects by location"
            value={activeLocation}
            onChange={(value) => {
              setActiveLocation(value);
              setRotationOffset(0);
              setCurrentPage(1);
            }}
            options={locationOptions}
          />
          <WorkSelect
            ariaLabel="Filter projects by status"
            value={activeStatus}
            onChange={(value) => {
              setActiveStatus(value);
              setRotationOffset(0);
              setCurrentPage(1);
            }}
            options={[
              { label: "Status", value: "all" },
              ...projectStatuses.map((status) => ({
                label: status,
                value: status.toLocaleLowerCase(),
              })),
            ]}
          />
          <WorkSelect
            ariaLabel="Sort projects"
            value={sortOrder}
            onChange={(value) => {
              setSortOrder(value as SortOrder);
              setRotationOffset(0);
              setCurrentPage(1);
            }}
            options={[
              { label: "Sort by", value: "featured" },
              { label: "Name A-Z", value: "name-asc" },
              { label: "Name Z-A", value: "name-desc" },
            ]}
          />
        </div>
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {pageProjects.length} of {visibleProjects.length} projects
        </p>

        {visibleProjects.length === 0 ? (
          <div className="wide-screen-body-sm flex flex-1 items-center justify-center px-5 pb-20 text-sm text-white/65">
            No projects match these filters.
          </div>
        ) : viewMode === "curated" ? (
          <div className="min-h-0 flex-1">
            <CuratedProjectGroup
              projects={curatedSections[0]}
              rotationOffset={rotationOffset}
              sectionIndex={0}
              featuredSide="left"
            />
          </div>
        ) : (
          <div className="wide-screen-max wide-screen-gutter mx-auto grid w-full max-w-[1600px] grid-cols-1 content-start gap-x-5 gap-y-8 px-5 pb-3 sm:grid-cols-2 md:px-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10 lg:px-[6.8vw]">
            {Array.from({ length: GRID_PROJECTS_PER_PAGE }, (_, index) => {
              const project = pageProjects[index];

              return project ? (
                <GridProjectCard key={project.slug} project={project} />
              ) : (
                <div
                  key={`empty-project-slot-${index}`}
                  aria-hidden="true"
                  className="invisible aspect-[1.62/1]"
                />
              );
            })}
          </div>
        )}
      </div>

      {viewMode === "curated"
        ? curatedSections.slice(1).map((projects, index) => {
            const sectionIndex = index + 1;

            return (
              <div
                key={`curated-section-${sectionIndex}`}
                className="min-h-[38rem] lg:h-[80svh] lg:min-h-[42rem]"
              >
                <CuratedProjectGroup
                  projects={projects}
                  rotationOffset={rotationOffset}
                  sectionIndex={sectionIndex}
                  featuredSide={sectionIndex % 2 === 1 ? "right" : "left"}
                />
              </div>
            );
          })
        : null}

      {visibleProjects.length > 0 ? (
        <WorkPagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
      ) : null}
    </section>
  );
}
