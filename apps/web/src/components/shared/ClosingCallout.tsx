import Image from "next/image";
import Link from "next/link";

interface CalloutImage {
  alt: string;
  src: string;
}

export interface ClosingCalloutProps {
  backgroundImage?: CalloutImage;
  className?: string;
  contentTone?: "dark" | "light";
  description?: string;
  href?: string;
  insetImage?: CalloutImage;
  linkLabel?: string;
  tone?: "dark" | "light";
  title?: string;
}

const defaultDescription =
  "For Over Three Decades, ECAD Design Architects Has Created Architecture That Responds To People, Place And Purpose. Every Project Is Approached With Curiosity, Technical Rigour And A Commitment To Delivering Lasting Value. Guided By A Belief That Great Design Should Stand The Test Of Time, The Practice Continues To Shape Environments That Inspire The Way People Live, Work And Connect.";

export default function ClosingCallout({
  backgroundImage = {
    src: "/project-detail-hero.jpg",
    alt: "Contemporary ECAD-designed residential development",
  },
  className = "",
  contentTone = "light",
  description = defaultDescription,
  href = "/contact?form=project#contact-form",
  insetImage = {
    src: "/practice-collaboration.jpg",
    alt: "Design team collaborating around architectural drawings",
  },
  linkLabel = "Work With ECAD",
  tone = "light",
  title = "Let's Build What Matters.",
}: ClosingCalloutProps) {
  const usesDarkContent = contentTone === "dark";

  return (
    <section
      aria-label={title}
      className={`wide-screen-gutter ${tone === "dark" ? "bg-[#202120]" : "bg-white"} px-[clamp(1.25rem,3vw,3rem)] pb-[clamp(4rem,10vw,10rem)] pt-[clamp(3.5rem,5.4vw,5rem)] ${className}`}
    >
      <div className="wide-screen-max relative mx-auto min-h-[38rem] w-full max-w-[1600px] overflow-hidden rounded-[7px] bg-[#5d615d] md:aspect-[2.35/1] md:min-h-0">
        <Image
          src={backgroundImage.src}
          alt={backgroundImage.alt}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {usesDarkContent ? (
          <>
            <div className="absolute inset-0 bg-white/50" />
            <div className="absolute inset-0 bg-linear-to-r from-white/5 via-white/20 to-white/55" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 bg-linear-to-r from-black/5 via-black/15 to-black/45" />
          </>
        )}

        <div className="absolute inset-0 z-20 md:inset-x-0 md:bottom-[7.5%] md:top-auto md:flex md:items-end">
          <div className="absolute bottom-[7.5%] left-[4%] aspect-[374/208] w-[92%] overflow-hidden rounded-[5px] bg-[#d9d9d9] shadow-[0_0_0_1px_rgba(255,255,255,0.12)] md:relative md:bottom-auto md:left-auto md:ml-[4%] md:w-[27.8%] md:shrink-0">
            <Image
              src={insetImage.src}
              alt={insetImage.alt}
              fill
              sizes="(min-width: 768px) 28vw, 52vw"
              className="object-cover object-center"
            />
          </div>

          <div
            className={`absolute inset-x-6 top-8 md:relative md:inset-x-auto md:top-auto md:ml-[24.7%] md:w-[39.5%] md:shrink-0 ${usesDarkContent ? "text-[#202120]" : "text-white"}`}
          >
            <h2 className="wide-screen-heading-md text-[clamp(1.15rem,1.85vw,1.4rem)] font-semibold leading-none tracking-[-0.04em]">
              {title}
            </h2>
            <p
              className={`wide-screen-body-sm ${usesDarkContent ? "mt-[clamp(2.5rem,4.7vw,4rem)] leading-[1.4]" : "mt-[clamp(2rem,3.7vw,2.5rem)] leading-[1.32]"} max-w-[38rem] text-[clamp(0.78rem,1.3vw,0.9rem)] tracking-[-0.02em]`}
            >
              {description}
            </p>

            <Link
              href={href}
              className={`wide-screen-label group ${usesDarkContent ? "mt-[clamp(2.5rem,4.4vw,3.5rem)]" : "mt-[clamp(2rem,3.4vw,2.5rem)]"} inline-flex overflow-hidden rounded-[3px] border text-[clamp(0.68rem,0.8vw,0.76rem)] font-medium leading-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                usesDarkContent
                  ? "border-[#202120] text-[#202120] hover:bg-[#202120] hover:text-white focus-visible:outline-[#202120]"
                  : "border-white text-white hover:bg-white hover:text-[#202120] focus-visible:outline-white"
              }`}
            >
              <span className="px-4 py-[0.7rem]">{linkLabel}</span>
              <span className="flex items-center  px-3 transition-colors duration-300 group-hover:border-[#202120]">
                <Image
                  src="/work-project-arrow.svg"
                  alt=""
                  width={12}
                  height={12}
                  aria-hidden="true"
                  className={`size-3 transition-[filter,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${usesDarkContent ? "invert group-hover:invert-0" : "group-hover:invert"}`}
                />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
