import Link from "next/link";

interface WorkInProgressPageProps {
  section: string;
}

export default function WorkInProgressPage({
  section,
}: WorkInProgressPageProps) {
  return (
    <main className="relative isolate flex min-h-[calc(100svh-76px)] flex-1 overflow-hidden bg-[#f1f1f0] md:min-h-[calc(100svh-72px)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[url('/topography-pattern.svg')] bg-[length:52rem_52rem] bg-center opacity-[0.08]"
      />

      <div className="wide-screen-max wide-screen-gutter mx-auto grid w-full max-w-[1440px] items-center gap-16 px-5 py-16 sm:px-8 md:grid-cols-[minmax(0,0.85fr)_minmax(20rem,1.15fr)] md:px-12 md:py-24 lg:gap-24 lg:px-20">
        <div className="max-w-[42rem]">
          <p className="wide-screen-label text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
            ECAD / {section}
          </p>
          <h1 className="wide-screen-title mt-6 text-[clamp(3.5rem,7.5vw,7.5rem)] font-semibold leading-[0.86] tracking-[-0.07em] text-[#14843b]">
            Work in
            <br />
            progress.
          </h1>
          <p className="wide-screen-large-copy mt-8 max-w-[31rem] text-[clamp(0.95rem,1.25vw,1.15rem)] leading-relaxed tracking-[-0.02em] text-black/65">
            This section is still taking shape. We are treating it like the rest
            of the site: deliberate structure, clear hierarchy, and careful
            finishing.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/work"
              className="wide-screen-label group inline-flex min-h-12 items-center gap-8 bg-[#14843b] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#0f6d31] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14843b]"
            >
              <span>Explore our work</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <Link
              href="/"
              className="wide-screen-label inline-flex min-h-12 items-center border border-black/35 px-6 text-sm font-semibold transition-colors hover:border-black hover:bg-white/55 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              Back home
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative mx-auto aspect-square w-full max-w-[34rem]"
        >
          <div className="absolute inset-[6%] rounded-full border border-black/20" />
          <div className="absolute inset-[19%] rounded-full border border-black/15" />
          <div className="absolute inset-[32%] rounded-full border border-black/10" />
          <div className="absolute inset-[6%] rounded-full border border-transparent border-t-[#14843b] animate-spin [animation-duration:14s]" />

          <div className="absolute left-1/2 top-[6%] h-[44%] w-px -translate-x-1/2 bg-black/25" />
          <div className="absolute left-[6%] top-1/2 h-px w-[44%] -translate-y-1/2 bg-black/25" />
          <div className="absolute right-[6%] top-1/2 h-px w-[44%] -translate-y-1/2 bg-black/25" />
          <div className="absolute bottom-[6%] left-1/2 h-[44%] w-px -translate-x-1/2 bg-black/25" />

          <div className="absolute left-1/2 top-1/2 grid size-[28%] -translate-x-1/2 -translate-y-1/2 place-items-center bg-[#14843b] shadow-[0_20px_60px_rgba(20,132,59,0.18)]">
            <div className="relative size-[48%] border-[clamp(3px,0.6vw,7px)] border-white">
              <span className="absolute bottom-[18%] right-[18%] size-[28%] bg-[#fff269]" />
            </div>
          </div>

          <span className="absolute right-[12%] top-[17%] size-4 rounded-full bg-[#fff269] md:size-5" />
          <span className="absolute bottom-[14%] left-[18%] size-3 rounded-full border border-black bg-transparent md:size-4" />
        </div>
      </div>
    </main>
  );
}
