import HeroSection from "@/components/landing/HeroSection";
import PracticeSection from "@/components/landing/PracticeSection";
import { workProjects } from "@/components/work/projects";

const homeHeroProjectSlugs = [
  "the-pantheon",
  "l5",
  "the-coronation-bank",
  "asaharam-school-of-architecture",
  "paramount-twin-towers",
] as const;

const heroSlides = homeHeroProjectSlugs.map((slug) => {
  const project = workProjects.find((candidate) => candidate.slug === slug);

  if (!project) {
    throw new Error(`Missing home hero project: ${slug}`);
  }

  return {
    title: project.title,
    imageSrc: project.homeImageSrc ?? project.imageSrc,
    imageAlt: project.imageAlt,
    metadata: {
      status: project.status,
      year: project.year,
      category: project.category,
      location: project.location,
    },
  };
});

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection slides={heroSlides} />
      <PracticeSection />
    </main>
  );
}
