import Image from "next/image";
import Link from "next/link";

interface CulturePrinciple {
  body: string;
  ctaHref: string;
  ctaLabel: string;
  largeImage: {
    alt: string;
    src: string;
    video?: boolean;
  };
  lead: string;
  smallImage: {
    alt: string;
    src: string;
  };
  statement: string;
  textFirst?: boolean;
}

const culturePrinciples: readonly CulturePrinciple[] = [
  {
    lead: "Context",
    statement: "Understand. Design. Build.",
    body: "ECAD Considers The Conditions That Surround Every Project, Its People, Place, Climate, Culture And Purpose. Context Isn't Simply A Constraint; It Becomes A Starting Point For Meaningful Design.",
    ctaHref: "/work",
    ctaLabel: "Explore Our Work",
    largeImage: {
      src: "/culture-context-film.mp4",
      alt: "A film documenting ECAD's restoration of a cultural landmark",
      video: true,
    },
    smallImage: {
      src: "/project-harbour-point-residences.png",
      alt: "Harbour Point Residences beside the marina",
    },
  },
  {
    lead: "Craft",
    statement: "Ideas Become Architecture",
    body: "Design Is Only As Meaningful As Its Ability To Become Real. ECAD Brings Creative Thinking Together With Technical Knowledge, Coordination And Attention To Detail To Carry Ideas From Conception To Completion.",
    ctaHref: "/team",
    ctaLabel: "Meet The Team",
    largeImage: {
      src: "/project-coronation-bank-v2.png",
      alt: "Precisely detailed Coronation Bank headquarters",
    },
    smallImage: {
      src: "/project-ldp-office-tower.jpeg",
      alt: "LDP Office Tower expressing structure and material craft",
    },
    textFirst: true,
  },
  {
    lead: "Progression",
    statement: "Experience In Motion",
    body: "ECAD Considers The Conditions That Surround Every Project, Its People, Place, Climate, Culture And Purpose. Context Isn't Simply A Constraint; It Becomes A Starting Point For Meaningful Design.",
    ctaHref: "/work",
    ctaLabel: "Explore Our Work",
    largeImage: {
      src: "/project-lagos-medipark.jpeg",
      alt: "Lagos Medipark reflecting an evolving design practice",
    },
    smallImage: {
      src: "/project-tengen.jpg",
      alt: "Tengen development representing experience in motion",
    },
  },
];

function LargeImage({
  alt,
  priority,
  src,
  video,
}: CulturePrinciple["largeImage"] & { priority?: boolean }) {
  return (
    <div className="relative min-h-0 aspect-square overflow-hidden rounded-[5px] bg-[#d9d9d9] lg:h-full lg:aspect-auto">
      {video ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-label={alt}
          className="absolute inset-0 size-full object-cover"
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video element.
        </video>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 43vw, 100vw"
          className="object-cover"
          priority={priority}
        />
      )}
    </div>
  );
}

function PrincipleStory({
  body,
  ctaHref,
  ctaLabel,
  lead,
  smallImage,
  statement,
}: Pick<
  CulturePrinciple,
  "body" | "ctaHref" | "ctaLabel" | "lead" | "smallImage" | "statement"
>) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative aspect-[1.4/1] overflow-hidden rounded-[5px] bg-[#d9d9d9]">
        <Image
          src={smallImage.src}
          alt={smallImage.alt}
          fill
          sizes="(min-width: 1024px) 38vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="mt-[clamp(2rem,4.4vw,3rem)] flex flex-1 flex-col border-t border-white/70 pt-[clamp(0.75rem,1.4vw,1rem)]">
        <p className="wide-screen-body-sm text-[clamp(0.72rem,1.15vw,0.82rem)] leading-[1.32] tracking-[-0.02em] text-white">
          {body}
        </p>

        <Link
          href={ctaHref}
          className="wide-screen-label group mt-2 flex items-center justify-end gap-3 text-[clamp(0.7rem,1.1vw,0.78rem)] font-semibold leading-none text-white"
        >
          {ctaLabel}
          <Image
            src="/work-project-arrow.svg"
            alt=""
            width={12}
            height={12}
            aria-hidden="true"
            className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>

        <div className="wide-screen-body-lg font-display mt-auto flex items-end justify-between gap-5 pt-3 text-[clamp(0.9rem,1.6vw,1.05rem)] font-semibold leading-none tracking-[-0.035em] text-[#078633]">
          <p className="opacity-50">{lead}</p>
          <p className="text-right">{statement}</p>
        </div>
      </div>
    </div>
  );
}

export default function CulturePrinciplesSection() {
  return (
    <section
      aria-label="ECAD design principles"
      className="wide-screen-gutter bg-linear-to-b from-[#1D2920] to-[#1B1D0A] px-[clamp(2rem,6.7vw,7rem)] py-[clamp(4rem,7vw,7rem)] text-white"
    >
      <div className="space-y-[clamp(4rem,9vw,9rem)]">
        {culturePrinciples.map((principle, index) => {
          const story = (
            <PrincipleStory
              body={principle.body}
              ctaHref={principle.ctaHref}
              ctaLabel={principle.ctaLabel}
              lead={principle.lead}
              smallImage={principle.smallImage}
              statement={principle.statement}
            />
          );

          const largeImage = (
            <LargeImage
              {...principle.largeImage}
              priority={index === 0}
            />
          );

          return (
            <article
              key={principle.lead}
              className="grid items-stretch gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-[7.2vw]"
            >
              {principle.textFirst ? story : largeImage}
              {principle.textFirst ? largeImage : story}
            </article>
          );
        })}
      </div>
    </section>
  );
}
