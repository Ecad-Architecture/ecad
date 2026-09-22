import type { Metadata } from "next";

import HeroSection from "@/components/landing/HeroSection";
import PracticeSection from "@/components/landing/PracticeSection";
import { getFeaturedProjects } from "@/sanity/data/projects";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.ecadarchitects.com/#website",
  name: "ECAD Architects",
  alternateName: ["ECAD", "ECAD Design Architects", "ecadarchitects.com"],
  url: "https://www.ecadarchitects.com/",
  publisher: {
    "@id": "https://www.ecadarchitects.com/#organization",
  },
};

export default async function Home() {
  const featuredProjects = await getFeaturedProjects();

  const heroSlides = featuredProjects.map((project) => ({
    title: project.title,
    imageSrc: project.imageSrc,
    imageAlt: project.imageAlt,
    metadata: {
      status: project.status,
      year: project.year,
      category: project.category,
      location: project.location,
    },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <main className="flex-1">
        {heroSlides.length > 0 ? <HeroSection slides={heroSlides} /> : null}
        <PracticeSection />
      </main>
    </>
  );
}
