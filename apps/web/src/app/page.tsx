import HeroSection from "@/components/landing/HeroSection";
import PracticeSection from "@/components/landing/PracticeSection";
import { getFeaturedProjects } from "@/sanity/data/projects";

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
    <main className="flex-1">
      {heroSlides.length > 0 ? <HeroSection slides={heroSlides} /> : null}
      <PracticeSection />
    </main>
  );
}
