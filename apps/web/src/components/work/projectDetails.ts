import { workProjects } from "./projects";

export const galleryCategories = ["Plans", "Renders", "Media"] as const;
export type GalleryCategory = (typeof galleryCategories)[number];
export interface ProjectGalleryGroup {
  category: GalleryCategory;
  images: readonly { alt: string; src: string }[];
}

export interface ProjectDetail {
  galleryGroups?: readonly ProjectGalleryGroup[];
  category: string;
  details: readonly {
    label: string;
    value: string;
  }[];
  description: string;
  galleryImages: readonly {
    alt: string;
    src: string;
  }[];
  heroAlt: string;
  heroSrc: string;
  location: string;
  overviewAlt: string;
  overviewDescription: string;
  overviewSrc: string;
  nextPreview: {
    alt: string;
    src: string;
  };
  poolAlt: string;
  poolSrc: string;
  previousPreview: {
    alt: string;
    src: string;
  };
  slug: string;
  title: string;
  year: string;
}

const sharedDetail = {
  category: "Category",
  details: [
    { label: "Client", value: "Client" },
    { label: "Scope", value: "Scope" },
    { label: "Size", value: "Size" },
    { label: "Status", value: "Status" },
  ],
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.",
  galleryImages: [
    {
      src: "/project-gallery-night-render.jpg",
      alt: "Night-time architectural rendering of the waterfront development",
    },
    {
      src: "/project-gallery-night.jpg",
      alt: "Illuminated waterfront development viewed across the water",
    },
    {
      src: "/project-gallery-aerial.jpg",
      alt: "Aerial view of the waterfront development at dusk",
    },
  ],
  heroAlt: "Contemporary multi-storey residential development",
  heroSrc: "/project-detail-hero.jpg",
  location: "Location",
  overviewAlt:
    "Street view of a contemporary white residential development framed by trees",
  overviewDescription: [
    "Lorem ipsum - dolor sit amet in consectetur, adipiscing ex elit.",
    "Sed euismod lectus non lorem vulputate, sed consequat magna consequat. Phasellus sagittis accumsan ex, sit amet tincidunt odio bibendum eu. Nunc varius augue sed elit maximus, vel suscipit lorem bibendum. Curabitur vel tortor diam. Aenean posuere, orci at fringilla tristique, urna nisi ullamcorper lorem, id tristique elit justo et urna.",
    "Fusce aliquam massa id purus tempus, at dapibus eros fringilla. Aliquam id massa sed enim ultricies facilisis vitae ut libero. Nunc vel ligula id metus ullamcorper facilisis non et risus. Etiam vulputate dui vehicula est consectetur sagittis. Cras in lacus ac sem sollicitudin posuere. Donec imperdiet felis quis sapien venenatis.",
    "Praesent congue orci sed lorem rhoncus, sed egestas odio venenatis. Nunc ut sapien magna. Suspendisse eu nulla scelerisque, facilisis felis in, convallis nisl. Proin ac mauris eu ex elementum lacinia eu aliquet mi.",
  ].join("\n\n"),
  overviewSrc: "/project-overview.png",
  nextPreview: {
    src: "/next-project-preview.jpg",
    alt: "Front elevation of a contemporary glass office building",
  },
  poolAlt:
    "Swimming pools beside the stone and white facade of the residential development",
  poolSrc: "/project-details-pool.png",
  previousPreview: {
    src: "/previous-project-preview.jpg",
    alt: "Courtyard view of a residential development with palm trees",
  },
  year: "Year",
} as const;

const portfolioProjectDetails: ProjectDetail[] = workProjects.map(
  (project) => ({
    ...sharedDetail,
    category: project.category,
    description: project.description,
    details: [
      { label: "Project", value: project.title },
      { label: "Scope", value: "Architecture & Design" },
      { label: "Size", value: project.area },
      { label: "Status", value: project.status },
    ],
    galleryImages:
      project.slug === "tengen" ? sharedDetail.galleryImages : [],
    heroAlt: project.imageAlt,
    heroSrc: project.imageSrc,
    location: project.location,
    overviewAlt: project.imageAlt,
    overviewSrc: project.imageSrc,
    poolAlt:
      project.slug === "tengen" ? sharedDetail.poolAlt : project.imageAlt,
    poolSrc:
      project.slug === "tengen" ? sharedDetail.poolSrc : project.imageSrc,
    slug: project.slug,
    title: project.title,
    year: project.year,
  }),
);

const legacyProjectDetails: ProjectDetail[] = [
  {
    ...sharedDetail,
    slug: "hallmark-project",
    title: "Project Title",
  },
  {
    ...sharedDetail,
    slug: "hallmark-project-2010s",
    title: "Hallmark Project Title",
  },
  {
    ...sharedDetail,
    slug: "hallmark-project-2000s",
    title: "Hallmark Project Title",
  },
];

export const projectDetails: readonly ProjectDetail[] = [
  ...portfolioProjectDetails,
  ...legacyProjectDetails,
];

export function getProjectDetail(slug: string) {
  return projectDetails.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const isPortfolioProject = portfolioProjectDetails.some(
    (project) => project.slug === slug,
  );
  const collection = isPortfolioProject
    ? portfolioProjectDetails
    : legacyProjectDetails;
  const currentIndex = collection.findIndex(
    (project) => project.slug === slug,
  );

  if (currentIndex === -1) {
    return undefined;
  }

  return {
    previous:
      collection[
        (currentIndex - 1 + collection.length) % collection.length
      ],
    next: collection[(currentIndex + 1) % collection.length],
  };
}
