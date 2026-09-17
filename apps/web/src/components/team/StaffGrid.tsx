"use client";

import { REDUCE_SITE_MOTION as shouldReduceMotion } from "@/motion";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import styles from "./StaffGrid.module.css";

const staffNames = [
  ["Amara", "Okafor"],
  ["Daniel", "Adebayo"],
  ["Ifeoma", "Nwosu"],
  ["Tunde", "Balogun"],
  ["Zainab", "Bello"],
  ["Chinedu", "Eze"],
  ["Maya", "Chen"],
  ["Samuel", "Hart"],
  ["Kwame", "Mensah"],
  ["Leila", "Haddad"],
  ["Sofia", "Marin"],
  ["Noah", "Williams"],
  ["Adaeze", "Obi"],
  ["Femi", "Ogunleye"],
  ["Nneka", "Umeh"],
  ["Emeka", "Okoro"],
  ["Amina", "Yusuf"],
  ["David", "Cole"],
  ["Lara", "Mensah"],
  ["Kunle", "Adeyemi"],
  ["Chioma", "Ibekwe"],
  ["Omar", "Farouk"],
  ["Grace", "Etim"],
  ["Nathan", "Brooks"],
  ["Yewande", "Ajayi"],
  ["Kelechi", "Onuoha"],
  ["Mariam", "Sule"],
  ["Ethan", "Reed"],
  ["Ivy", "Zhang"],
  ["Nabil", "Hassan"],
  ["Bukola", "Thomas"],
  ["Jordan", "Lee"],
  ["Ayo", "Bankole"],
  ["Sara", "Patel"],
  ["Michael", "Stone"],
  ["Halima", "Garba"],
] as const;

const staffRoles = [
  "Principal Architect",
  "Associate Architect",
  "Project Architect",
  "Senior Architect",
  "Architect",
  "Interior Architect",
  "Urban Designer",
  "Technical Architect",
  "BIM Coordinator",
  "Design Architect",
  "Landscape Architect",
  "Project Coordinator",
] as const;

const exTeamMembers = [
  "Adeola Martins",
  "Chisom Nnamani",
  "Damilola George",
  "Efe Osagie",
  "Folake Adeniran",
  "Ibrahim Lawal",
  "Kemi Oladipo",
  "Morenike Peters",
  "Nosa Eromosele",
  "Oyinda Aluko",
  "Seyi Olatunji",
  "Temilade Johnson",
] as const;

const profileBiography =
  "Brings a thoughtful approach to design, translating context, collaboration and technical rigour into architecture that serves people and place. Their work moves carefully from early ideas through coordination and delivery.";

const staffNameClassName =
  "wide-screen-caption text-[clamp(0.62rem,0.72vw,0.72rem)] font-medium leading-[1.2] tracking-tight";

const staffPortraits = [
  "/team/staff-07.webp",
  "/team/staff-02.webp",
  "/team/staff-14.webp",
  "/team/staff-05.webp",
  "/team/staff-11.webp",
  "/team/staff-16.webp",
  "/team/staff-01.webp",
  "/team/staff-12.webp",
  "/team/staff-08.webp",
  "/team/staff-03.webp",
  "/team/staff-15.webp",
  "/team/staff-10.webp",
  "/team/staff-06.webp",
  "/team/staff-17.webp",
  "/team/staff-04.webp",
  "/team/staff-13.webp",
  "/team/staff-09.webp",
] as const;

/* Hierarchy categories retained for restoring the grouped layout.
const staffCategories = [
  { end: 6, start: 0, title: "Directors" },
  { end: 12, start: 6, title: "Senior Architects" },
  { end: staffPortraits.length, start: 12, title: "Junior Architects" },
] as const;
*/

interface SelectedProfile {
  height: number;
  imageWidth: number;
  index: number;
  left: number;
  top: number;
  width: number;
}

function getPortrait(index: number) {
  const portrait = staffPortraits[index];

  return {
    backgroundImage: `url('${portrait}')`,
    backgroundPosition: "center top",
    backgroundSize: "cover",
  };
}

function ProfileContent({
  headingId,
  index,
}: {
  headingId: string;
  index: number;
}) {
  const [firstName, surname] = staffNames[index];

  return (
    <div className={`${styles.content} flex min-h-0 flex-col p-[clamp(1.25rem,2.1vw,1.875rem)]`}>
      <div className={`${styles.copy} w-[200px] 2xl:w-[300px] max-w-full`}>
        <h3
          id={headingId}
          className={`${styles.name} wide-screen-caption text-[16px] xl:text-[20px] font-medium leading-[1.08] tracking-[-0.035em]`}
        >
          <span className="block">{firstName}</span>
          <span className="block">{surname}</span>
        </h3>
        <p className={`${styles.role} mt-2 text-[14px] font-medium leading-none text-brand-yellow`}>
          {staffRoles[index % staffRoles.length]}
        </p>
        <p className={`${styles.biography} wide-screen-micro mt-4 w-full text-[8px] leading-[1.3] tracking-[-0.01em] text-white/90`}>
          {profileBiography}
        </p>
      </div>
    </div>
  );
}

export default function StaffGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopCloseButtonRef = useRef<HTMLButtonElement>(null);
  const mobileCloseButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedProfile, setSelectedProfile] =
    useState<SelectedProfile | null>(null);

  useEffect(() => {
    if (!selectedProfile) {
      return;
    }

    const usesDesktopProfile = window.matchMedia("(min-width: 64rem)").matches;
    const activeCloseButton = usesDesktopProfile
      ? desktopCloseButtonRef.current
      : mobileCloseButtonRef.current;

    activeCloseButton?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProfile(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedProfile]);

  const openProfile = (index: number, trigger: HTMLButtonElement) => {
    const container = containerRef.current;
    const grid = trigger.closest<HTMLElement>("[data-staff-grid]");
    const image = trigger
      .closest("article")
      ?.querySelector<HTMLElement>("[data-staff-image]");

    if (!container || !grid || !image) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const columnGap = Number.parseFloat(getComputedStyle(grid).columnGap) || 16;
    const usesLargeProfile = window.matchMedia("(min-width: 90rem)").matches;
    const imageWidth = imageRect.width;
    const width = Math.min(
      containerRect.width,
      usesLargeProfile
        ? imageWidth * 3 + columnGap * 2
        : imageWidth * 2.5 + columnGap * 1.5,
    );
    const naturalLeft = imageRect.left - containerRect.left;

    setSelectedProfile({
      height: imageRect.height,
      imageWidth,
      index,
      left: Math.min(
        Math.max(0, naturalLeft),
        Math.max(0, containerRect.width - width),
      ),
      top: imageRect.top - containerRect.top,
      width,
    });
  };

  return (
    <section
      aria-label="ECAD Architects team directory"
      className="wide-screen-gutter bg-transparent px-[clamp(1.5rem,6.8vw,7rem)] pb-[clamp(4rem,6vw,6rem)] pt-[clamp(3.5rem,5vw,5rem)] text-white"
    >
      <div ref={containerRef} className="wide-screen-max relative mx-auto w-full max-w-[1600px]">
        <div
          aria-hidden={selectedProfile ? true : undefined}
          inert={selectedProfile ? true : undefined}
          className="space-y-[clamp(3rem,6vw,6rem)]"
        >
          <div
            data-staff-grid
            className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-4 lg:gap-y-8"
          >
            {staffNames
              .slice(0, staffPortraits.length)
              .map(([firstName, surname], index) => {
                const fullName = `${firstName} ${surname}`;

                return (
                  <article key={fullName} className={`group ${styles.card}`}>
                    <button
                      type="button"
                      data-staff-image
                      data-selected={selectedProfile?.index === index}
                      aria-label={`View ${fullName}'s profile`}
                      aria-haspopup="dialog"
                      className={`${styles.portrait} block aspect-square w-full bg-[#d9d9d9] bg-no-repeat focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
                      style={getPortrait(index)}
                      onClick={(event) => openProfile(index, event.currentTarget)}
                    />

                    <div className={`${staffNameClassName} mt-1 space-y-1 py-1`}>
                      <p className="whitespace-nowrap">{fullName}</p>
                      <p className="text-[0.85em] font-normal leading-[1.3] text-white/70">
                        {staffRoles[index % staffRoles.length]}
                      </p>
                      {/* <button
                        type="button"
                        aria-label={`View ${fullName}'s profile`}
                        className="inline-flex size-7 shrink-0 items-center justify-end rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:size-9"
                        onClick={(event) =>
                          openProfile(index, event.currentTarget)
                        }
                      >
                        <Image
                          src="/work-project-arrow.svg"
                          alt=""
                          width={18}
                          height={18}
                          aria-hidden="true"
                          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 lg:size-[12px]"
                        />
                      </button> */}
                    </div>
                  </article>
                );
              })}
          </div>

          {/* Hierarchy layout retained for later use.
          {staffCategories.map((category) => (
            <section key={category.title} aria-labelledby={`staff-${category.start}`}>
              <h2
                id={`staff-${category.start}`}
                className="wide-screen-section-title mb-[clamp(1rem,2vw,1.75rem)] text-[clamp(1.25rem,1.8vw,1.75rem)] font-medium leading-none tracking-[-0.04em]"
              >
                {category.title}
              </h2>

              <div
                data-staff-grid
                className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-4 lg:gap-y-8"
              >
                {staffNames
                  .slice(category.start, category.end)
                  .map(([firstName, surname], categoryIndex) => {
                    const index = category.start + categoryIndex;
                    const fullName = `${firstName} ${surname}`;

                    return (
                      <article key={fullName} className="group">
                        <div
                          data-staff-image
                          role="img"
                          aria-label={`Portrait of ${fullName}`}
                          className={`aspect-square w-full bg-[#d9d9d9] bg-no-repeat transition-[filter] duration-500 ease-out ${
                            selectedProfile?.index === index
                              ? "grayscale-0"
                              : "grayscale group-hover:grayscale-0 group-focus-within:grayscale-0"
                          }`}
                          style={getPortrait(index)}
                        />

                        <div className="wide-screen-caption mt-1 flex items-center justify-between gap-2 text-[clamp(0.62rem,0.72vw,0.72rem)] font-medium leading-[0.98] tracking-[-0.025em]">
                          <p>
                            <span className="block py-1">{firstName}</span>
                            <span className="block">{surname}</span>
                          </p>
                          <button
                            type="button"
                            aria-label={`View ${fullName}'s profile`}
                            className="inline-flex size-7 shrink-0 items-center justify-end rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:size-9"
                            onClick={(event) =>
                              openProfile(index, event.currentTarget)
                            }
                          >
                            <Image
                              src="/work-project-arrow.svg"
                              alt=""
                              width={18}
                              height={18}
                              aria-hidden="true"
                              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 lg:size-[12px]"
                            />
                          </button>
                        </div>
                      </article>
                    );
                  })}
              </div>
            </section>
          ))}
          */}

          <details className="group w-full">
            <summary className="wide-screen-body-sm flex w-fit cursor-pointer list-none items-center gap-4 text-[clamp(0.8rem,0.95vw,0.9rem)] font-medium leading-none outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#1D2920] [&::-webkit-details-marker]:hidden">
              <span
                aria-hidden="true"
                className="inline-flex size-4 origin-center items-center justify-center text-xl font-light leading-none transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
              <span>Ex Team Members</span>
            </summary>

            <ul className="mt-[clamp(1.5rem,3vw,2.5rem)] grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {exTeamMembers.map((name) => (
                <li
                  key={name}
                  className={`${staffNameClassName} flex items-center gap-2.5 text-white/90`}
                >
                  <span
                    aria-hidden="true"
                    className="size-1 shrink-0 rounded-full bg-current"
                  />
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>

        <AnimatePresence initial={false}>
          {selectedProfile ? (
            <>
            <motion.button
              type="button"
              aria-label="Close selected team member"
              className="absolute inset-0 z-20 hidden cursor-default bg-[#202120]/25 backdrop-blur-[3px] lg:block"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.65, ease: "easeInOut" }}
              onClick={() => setSelectedProfile(null)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="selected-team-member-desktop"
              className="absolute z-30 hidden overflow-hidden rounded-[8px] border border-white/80 bg-[#202120] text-white shadow-2xl lg:grid"
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      clipPath: `inset(0 ${Math.max(
                        0,
                        (1 - selectedProfile.imageWidth / selectedProfile.width) *
                          100,
                      )}% 0 0 round 8px)`,
                    }
              }
              animate={{ opacity: 1, clipPath: "inset(0 0% 0 0 round 8px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.65, ease: "easeInOut" }}
              style={{
                gridTemplateColumns: `${selectedProfile.imageWidth}px minmax(0, 1fr)`,
                height: selectedProfile.height,
                left: selectedProfile.left,
                top: selectedProfile.top,
                width: selectedProfile.width,
              }}
            >
              <div
                role="img"
                aria-label={`Portrait of ${staffNames[selectedProfile.index].join(" ")}`}
                className="h-full w-full bg-[#d9d9d9] bg-no-repeat"
                style={getPortrait(selectedProfile.index)}
              />
              <div className={`${styles.desktopDetails} relative min-h-0`}>
                <ProfileContent
                  headingId="selected-team-member-desktop"
                  index={selectedProfile.index}
                />
                <button
                  ref={desktopCloseButtonRef}
                  type="button"
                  aria-label="Close profile"
                  className={`${styles.closeButton} absolute right-[14%] top-[52%] flex size-10 -translate-y-1/2 items-center justify-center rounded-sm transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
                  onClick={() => setSelectedProfile(null)}
                >
                  <Image
                    src="/team-profile-close-arrow.svg"
                    alt=""
                    width={15}
                    height={14}
                    aria-hidden="true"
                    className="h-[14px] w-[15px]"
                  />
                </button>
              </div>
            </motion.div>

            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#202120]/45 p-4 backdrop-blur-[4px] lg:hidden">
              <button
                type="button"
                aria-label="Close selected team member"
                className="absolute inset-0 cursor-default"
                onClick={() => setSelectedProfile(null)}
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="selected-team-member-mobile"
                className={`${styles.mobileProfile} relative z-10 max-h-[90svh] w-full max-w-md overflow-y-auto border border-white/25 bg-[#202120] text-white shadow-2xl`}
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, scale: 0.96, y: 12 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 8 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.65, ease: "easeInOut" }}
              >
                <div
                  role="img"
                  aria-label={`Portrait of ${staffNames[selectedProfile.index].join(" ")}`}
                  className="aspect-square bg-[#d9d9d9] bg-no-repeat"
                  style={getPortrait(selectedProfile.index)}
                />
                <ProfileContent
                  headingId="selected-team-member-mobile"
                  index={selectedProfile.index}
                />
                <button
                  ref={mobileCloseButtonRef}
                  type="button"
                  aria-label="Close profile"
                  className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-[#202120]/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  onClick={() => setSelectedProfile(null)}
                >
                  <Image
                    src="/team-profile-close-arrow.svg"
                    alt=""
                    width={15}
                    height={14}
                    aria-hidden="true"
                    className="h-[14px] w-[15px]"
                  />
                </button>
              </motion.div>
            </div>
            </>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
