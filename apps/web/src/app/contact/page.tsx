import type { Metadata } from "next";
import Image from "next/image";

import ContactForms from "@/components/contact/ContactForms";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with ECAD Architects or explore opportunities to join the practice.",
};

interface ContactPageProps {
  searchParams: Promise<{ form?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { form } = await searchParams;
  const initialForm =
    form === "project" || form === "practice" ? form : null;

  return (
    <main className="flex-1 bg-[#202120]">
      <section aria-labelledby="contact-heading">
        <div className="contact-hero relative h-[var(--contact-hero-height,calc(100svh-18rem))] shrink-0 overflow-hidden bg-[#d8d5ce]">
          <Image
            src="/project-detail-hero.jpg"
            alt="Contemporary ECAD-designed residential development framed by mature trees"
            fill
            sizes="100vw"
            className="object-cover object-center"
            preload
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="wide-screen-max wide-screen-gutter absolute inset-x-0 bottom-[clamp(3rem,9vh,6.25rem)] z-10 mx-auto w-full max-w-[1600px] px-5 md:px-8 lg:px-[6.8vw]">
            <h1
              id="contact-heading"
                className="wide-screen-title text-[clamp(2.75rem,5.5vw,4rem)] font-semibold leading-none tracking-[-0.055em] text-white drop-shadow-sm"
            >
              Contact Us
            </h1>
          </div>
        </div>

        <ContactForms initialForm={initialForm} />
      </section>
    </main>
  );
}
