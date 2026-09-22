import AnimatedFingerprintBackground from "@/components/shared/AnimatedFingerprintBackground";

interface CultureOverviewSectionProps {
  title: string;
  introduction: string;
  resources: Array<{
    key: string;
    title: string;
    body: string;
    isExpandable: boolean;
  }>;
  beliefs: Array<{
    title: string;
    body: string;
  }>;
}

export default function CultureOverviewSection({
  title,
  introduction,
  resources,
  beliefs,
}: CultureOverviewSectionProps) {
  return (
    <section
      aria-labelledby="about-ecad-title"
      className="relative isolate grid min-h-svh overflow-hidden bg-white text-[#202120] lg:grid-cols-2"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full lg:w-[62%]"
      >
        <AnimatedFingerprintBackground
          colors={["#c9dfd0", "#ead8cf", "#d4e0e8"]}
          colorIntervalSeconds={5}
          opacity={0.12}
          patternSize="clamp(320px, 35vw, 560px) auto"
        />
        <div className="absolute inset-y-0 left-0 w-[30%] bg-linear-to-r from-white via-white/80 to-transparent lg:w-[20%]" />
      </div>

      <div className="wide-screen-left-gutter relative z-10 flex flex-col px-[clamp(1.5rem,6.8vw,7rem)] pt-5 pb-8 lg:pb-12 lg:pr-[clamp(2.5rem,5vw,6rem)] lg:pt-[17svh]">
        <h2
          id="about-ecad-title"
          className="wide-screen-heading-lg text-[clamp(1.65rem,2vw,2rem)] font-semibold leading-none tracking-[-0.045em]"
        >
          {title}
        </h2>

        <p className="wide-screen-body-md mt-[clamp(2.5rem,7vh,4.25rem)] max-w-136 text-[clamp(0.85rem,1vw,0.95rem)] leading-[1.3] tracking-[-0.02em] whitespace-pre-wrap">
          {introduction}
        </p>

        <div
          aria-hidden="true"
          className="mt-[clamp(1.5rem,4vh,2.5rem)] h-px w-full max-w-136 bg-[#202120]/70"
        />

        <div className="wide-screen-body-sm mt-[clamp(2.5rem,7vh,4rem)] space-y-3 text-[clamp(0.8rem,0.95vw,0.9rem)] font-medium leading-none">
          {resources.map((resource) =>
            resource.isExpandable ? (
              <details key={resource.key} className="group max-w-136">
                <summary className="flex w-fit cursor-pointer list-none items-center gap-4 outline-none focus-visible:ring-2 focus-visible:ring-[#14843b] focus-visible:ring-offset-4 [&::-webkit-details-marker]:hidden">
                  <span
                    aria-hidden="true"
                    className="inline-flex size-4 origin-center items-center justify-center text-xl font-light leading-none transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                  <span>{resource.title}</span>
                </summary>
                <p className="wide-screen-label ml-8 mt-3 max-w-124 text-[clamp(0.78rem,0.9vw,0.86rem)] font-normal leading-[1.45] tracking-[-0.015em] text-[#202120]/80 whitespace-pre-wrap">
                  {resource.body}
                </p>
              </details>
            ) : (
              <p key={resource.key} className="max-w-136">
                {resource.title}
              </p>
            ),
          )}
        </div>
      </div>

      <div className="wide-screen-right-gutter relative z-10 flex flex-col px-[clamp(1.5rem,1.5vw,2rem)] pt-5 pb-8 lg:pb-12 lg:pr-[clamp(2rem,6.8vw,7rem)] lg:pt-[27.5svh]">
        <div className="max-w-172">
          {beliefs.map((belief, index) => (
            <div
              key={belief.title}
              className={index > 0 ? "mt-[clamp(2.75rem,8vh,5rem)]" : ""}
            >
              <h3 className="wide-screen-heading-sm text-[clamp(0.9rem,1vw,1rem)] font-semibold leading-tight tracking-tight">
                {belief.title}
              </h3>
              <p className="wide-screen-body-md mt-[clamp(1rem,2.5vh,1.5rem)] text-[clamp(0.85rem,1vw,0.95rem)] leading-[1.3] tracking-[-0.02em] whitespace-pre-wrap">
                {belief.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
