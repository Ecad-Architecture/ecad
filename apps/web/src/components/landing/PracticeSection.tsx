"use client";

import Image from "next/image";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import useResponsiveSectionInset from "./useResponsiveSectionInset";
import styles from "./PracticeSection.module.css";

interface PracticeItem {
  id: string;
  title: string;
  categories: string;
  imageSrc: string;
  imageAlt: string;
}

const practiceItems: readonly PracticeItem[] = [
  {
    id: "architectural-design",
    title: "Architectural Design",
    categories: "Residential | Commercial | Hospitality | Mixed Use",
    imageSrc: "/practice-architectural-design.jpg",
    imageAlt: "Curved contemporary architecture viewed from below",
  },
  {
    id: "master-planning",
    title: "Master Planning",
    categories: "Urban Planning | Site Strategy | Landscape | Infrastructure",
    imageSrc: "/practice-master-planning.jpg",
    imageAlt: "Aerial view of a landscaped master-planned development",
  },
  {
    id: "collaborative-design",
    title: "Collaborative Design",
    categories: "Research | Workshops | Concepts | Coordination",
    imageSrc: "/practice-collaboration.jpg",
    imageAlt: "A design team collaborating around drawings and material samples",
  },
  {
    id: "technical-delivery",
    title: "Technical Delivery",
    categories: "Design Development | Documentation | Detailing | Delivery",
    imageSrc: "/practice-technical-delivery.jpg",
    imageAlt: "An architect reviewing a large set of technical drawings",
  },
];

const practiceCopy =
  "Grounded in experience and driven by progression, ECAD creates architecture that responds to people, context and time. Every project reflects a commitment to thoughtful design, technical excellence and enduring impact.";

const transitionEase = [0.42, 0, 0.58, 1] as const;
const LABEL_CHARACTER_DELAY = 32;

function TypewriterLabel({ text }: { text: string }) {
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    if (text.length === 0) {
      return;
    }

    let nextCharacter = 0;
    const interval = window.setInterval(() => {
      nextCharacter += 1;
      setVisibleCharacters(nextCharacter);

      if (nextCharacter >= text.length) {
        window.clearInterval(interval);
      }
    }, LABEL_CHARACTER_DELAY);

    return () => window.clearInterval(interval);
  }, [text]);

  const isComplete = visibleCharacters >= text.length;
  const visibleText = text.slice(0, visibleCharacters);

  return (
    <span className="relative block whitespace-nowrap">
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        {visibleText}
        {!isComplete ? (
          <span className="ml-[0.08em] inline-block h-[0.8em] w-[2px] animate-pulse bg-current align-[-0.02em]" />
        ) : null}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

export default function PracticeSection() {
  const [activeId, setActiveId] = useState(practiceItems[0].id);
  const [thumbnailItems, setThumbnailItems] = useState<readonly PracticeItem[]>(
    practiceItems.slice(1),
  );
  const sectionRef = useRef<HTMLElement>(null);
  const horizontalInset = useResponsiveSectionInset();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });
  const sectionInset = useTransform(
    scrollYProgress,
    [0, 0.18, 0.95],
    [0, 0, horizontalInset],
  );
  const activeItem =
    practiceItems.find((item) => item.id === activeId) ?? practiceItems[0];
  const duration = 1.1;

  useEffect(() => {
    const section = sectionRef.current;
    const footer = document.getElementById("footer-reveal");

    if (!section || !footer) {
      return;
    }

    const updateFooterHeight = () => {
      section.style.setProperty(
        "--practice-footer-height",
        `${footer.getBoundingClientRect().height}px`,
      );
    };

    updateFooterHeight();
    const observer = new ResizeObserver(updateFooterHeight);
    observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  const selectItem = (nextItem: PracticeItem) => {
    const outgoingItem = activeItem;

    if (nextItem.id === outgoingItem.id) {
      return;
    }

    setActiveId(nextItem.id);
    setThumbnailItems((currentItems) => [
      ...currentItems.filter((item) => item.id !== nextItem.id),
      outgoingItem,
    ]);
  };

  return (
    <motion.section
      ref={sectionRef}
      id="practice"
      aria-labelledby="practice-heading"
      className={`${styles.section} flex min-h-[calc(100svh-38px)] items-center overflow-hidden bg-white py-[clamp(2.5rem,5.8svh,5rem)] will-change-[padding]`}
      style={{
        paddingInline: sectionInset,
      }}
    >
      <LayoutGroup id="practice-gallery">
        <div className={`${styles.gallery} wide-screen-max mx-auto grid w-full max-w-[1500px] gap-[clamp(0.75rem,1vw,1rem)] lg:h-[min(74.5svh,620px)] lg:grid-cols-[minmax(0,0.395fr)_minmax(0,0.605fr)]`}>
          <div className="relative isolate aspect-[1.04/1] min-h-0 overflow-hidden bg-white lg:aspect-auto lg:h-full">
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={activeItem.id}
                layoutId={`practice-image-${activeItem.id}`}
                className="absolute inset-0 overflow-hidden rounded-[8px]"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration, ease: transitionEase }}
              >
                <Image
                  src={activeItem.imageSrc}
                  alt={activeItem.imageAlt}
                  fill
                  priority={activeItem.id === practiceItems[0].id}
                  sizes="(min-width: 1024px) 38vw, 92vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            <div
              className={`${styles.label} ${styles.title} max-w-[calc(100%-1rem)] px-[clamp(0.75rem,1.25vw,1rem)] py-[clamp(0.75rem,1.25vw,1rem)]`}
            >
              <p className="font-display wide-screen-heading-sm text-[15px] md:text-[19px] font-semibold leading-none tracking-[-0.035em] text-[#1A7B34]">
                <TypewriterLabel
                  key={`practice-title-${activeItem.id}`}
                  text={activeItem.title}
                />
              </p>
            </div>

            <div
              className={`${styles.label} ${styles.categories} max-w-full px-[clamp(0.7rem,1.15vw,1rem)] py-[clamp(0.65rem,1.15vw,1rem)]`}
            >
              <p className="wide-screen-body-sm text-left text-[10px] md:text-[15px] leading-[1.15] tracking-[-0.025em]">
                <TypewriterLabel
                  key={`practice-categories-${activeItem.id}`}
                  text={activeItem.categories}
                />
              </p>
            </div>
          </div>

          <div className="grid min-h-0 gap-[clamp(0.75rem,1vw,1rem)] lg:grid-rows-[minmax(0,0.41fr)_minmax(0,0.59fr)]">
            <div className="relative min-h-[10rem] overflow-hidden rounded-[7px] bg-[rgba(26,123,52,0.1)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[url('/homepage-practice-texture.svg')] bg-[length:760px_214px] bg-center bg-repeat"
              />

              <div className="relative z-10 flex h-full flex-col justify-between px-[clamp(1rem,1.6vw,1.5rem)] py-[clamp(1rem,2.4svh,1.5rem)]">
                <h1
                  id="practice-heading"
                  className="wide-screen-heading-xl text-[20px] md:text-[48px] font-medium leading-none tracking-[-0.04em] text-[#14843b]"
                >
                  <span className="text-black">Discover</span> The Practice
                </h1>
                <p className="wide-screen-body max-w-[69ch] text-[clamp(0.74rem,1.15vw,1rem)] leading-[1.32] tracking-[-0.02em] text-[#202420]">
                  {practiceCopy}
                </p>
              </div>
            </div>

            <div className="order-first grid grid-cols-3 gap-[clamp(0.75rem,1vw,1rem)] lg:order-none">
              {thumbnailItems.map((item) => {
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    layout
                    layoutId={`practice-image-${item.id}`}
                    initial={false}
                    animate={{ opacity: 1 }}
                    onClick={() => selectItem(item)}
                    aria-label={`Show ${item.title}`}
                    className="group relative min-h-[10rem] overflow-hidden rounded-[7px] bg-[#e8e8e6] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14843b] cursor-pointer"
                    transition={{
                      duration,
                      ease: transitionEase,
                    }}
                  >
                    <Image
                      src={item.imageSrc}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 19vw, 30vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    />
                    <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/[0.05]" />
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </LayoutGroup>
    </motion.section>
  );
}
