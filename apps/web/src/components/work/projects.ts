export const projectCategories = [
  "All",
  "Residential",
  "Commercial",
  "Industrial",
  "Mixed Use",
  "Interior",
] as const;

export type ProjectCategory = Exclude<
  (typeof projectCategories)[number],
  "All"
>;

export interface WorkProject {
  area: string;
  category: ProjectCategory;
  description: string;
  homeImageSrc?: string;
  imageAlt: string;
  imageSrc: string;
  location: string;
  slug: string;
  status: string;
  title: string;
  year: string;
}

export const workProjects: readonly WorkProject[] = [
  {
    title: "The Pantheon",
    slug: "the-pantheon",
    location: "Victoria Island, Lagos",
    category: "Residential",
    status: "Completed",
    year: "2024",
    area: "18,500 sqm",
    imageSrc: "/project-tengen.jpg",
    homeImageSrc: "/home-tengen.png",
    imageAlt: "Tengen contemporary glass-fronted tower",
    description:
      "Tengen brings refined residential living together with a calm material palette, generous glazing, and carefully framed views across Lagos.",
  },
  {
    title: "LDP Office Tower",
    slug: "ldp-office-tower",
    location: "Victoria Island, Lagos",
    category: "Commercial",
    status: "Completed",
    year: "2023",
    area: "24,600 sqm",
    imageSrc: "/project-ldp-office-tower.jpeg",
    imageAlt: "Illuminated office tower against a deep blue evening sky",
    description:
      "A bold commercial landmark shaped by a disciplined facade grid, a sculpted podium, and a luminous presence along the city street.",
  },
  {
    title: "Lakepoint Towers",
    slug: "lakepoint-towers",
    location: "Banana Island, Lagos",
    category: "Commercial",
    status: "Completed",
    year: "2021",
    area: "19,200 sqm",
    imageSrc: "/project-lakepoint-towers.jpeg",
    imageAlt: "Twin blue-glass Lakepoint office towers beside the lagoon",
    description:
      "Lakepoint Towers pairs two waterfront office volumes above a shared podium, balancing efficient floorplates with broad lagoon views.",
  },
  {
    title: "Lagos Medipark Hospital",
    slug: "lagos-medipark-hospital",
    location: "Ikoyi, Lagos",
    category: "Mixed Use",
    status: "Completed",
    year: "2025",
    area: "42,000 sqm",
    imageSrc: "/project-lagos-medipark.jpeg",
    imageAlt: "Lagos Medipark Hospital complex beside an urban highway",
    description:
      "An integrated healthcare campus that combines specialist facilities, clear circulation, and landscaped public edges within a cohesive urban composition.",
  },
  {
    title: "National Arts Theatre",
    slug: "national-arts-theatre",
    location: "Iganmu, Lagos",
    category: "Interior",
    status: "Completed",
    year: "2022",
    area: "31,500 sqm",
    imageSrc: "/project-national-arts-theatre.jpeg",
    imageAlt: "National Arts Theatre with its restored cultural facade",
    description:
      "The renewal of an iconic cultural landmark strengthens its ceremonial arrival, public spaces, and enduring role in Nigeria's creative life.",
  },
  // {
  //   title: "Atlantic Terraces",
  //   slug: "atlantic-terraces",
  //   location: "Victoria Island, Lagos",
  //   category: "Residential",
  //   status: "Completed",
  //   year: "2025",
  //   area: "28,400 sqm",
  //   imageSrc: "/project-atlantic-terraces.png",
  //   imageAlt: "Sculpted residential towers illuminated at sunset",
  //   description:
  //     "Atlantic Terraces layers generous balconies, planting, and softly illuminated edges to create a distinctive coastal residential address.",
  // },
  {
    title: "Paramount Twin Towers",
    slug: "paramount-twin-towers",
    location: "Lekki, Lagos",
    category: "Residential",
    status: "Completed",
    year: "2024",
    area: "36,800 sqm",
    imageSrc: "/project-lac-citadel-residences.png",
    imageAlt: "Contemporary waterfront apartment development at sunset",
    description:
      "A waterfront residential community organised around framed balconies, warm facade accents, and shared amenities overlooking the Atlantic.",
  },
  {
    title: "The Coronation Bank",
    slug: "the-coronation-bank",
    location: "Victoria Island, Lagos",
    category: "Commercial",
    status: "Completed",
    year: "2025",
    area: "12,700 sqm",
    imageSrc: "/project-coronation-bank-v2.png",
    imageAlt: "The Coronation Bank headquarters framed by mature trees",
    description:
      "The Coronation Bank presents a composed civic frontage, combining deep vertical fins, warm interior light, and a carefully landscaped street edge.",
  },
  {
    title: "Asaharam School of Architecture",
    slug: "asaharam-school-of-architecture",
    location: "Lekki, Lagos",
    category: "Mixed Use",
    status: "Completed",
    year: "2025",
    area: "16,900 sqm",
    imageSrc: "/project-asaharam-school-architecture.png",
    imageAlt: "Asaharam School of Architecture set among palm trees",
    description:
      "A contemporary learning environment centred on a dramatic arched entrance, flexible studios, and shaded landscape spaces for collaboration.",
  },
  // {
  //   title: "Coronation House",
  //   slug: "coronation-house",
  //   location: "Ikoyi, Lagos",
  //   category: "Commercial",
  //   status: "Completed",
  //   year: "2020",
  //   area: "9,600 sqm",
  //   imageSrc: "/project-coronation-house.jpeg",
  //   imageAlt: "Coronation House illuminated at dusk",
  //   description:
  //     "Coronation House combines a welcoming glazed entrance with robust stone volumes to form a clear and secure institutional headquarters.",
  // },
  // {
  //   title: "Marina District",
  //   slug: "marina-district",
  //   location: "Marina, Lagos",
  //   category: "Mixed Use",
  //   status: "Completed",
  //   year: "2026",
  //   area: "84,000 sqm",
  //   imageSrc: "/project-marina-district.png",
  //   imageAlt: "Aerial view of a mixed-use waterfront district at night",
  //   description:
  //     "Marina District brings homes, workplaces, hospitality, and public waterfront spaces together in a connected neighbourhood shaped around the lagoon.",
  // },
  // {
  //   title: "Crescent Learning Centre",
  //   slug: "crescent-learning-centre",
  //   location: "Central Area, Abuja",
  //   category: "Mixed Use",
  //   status: "Completed",
  //   year: "2025",
  //   area: "14,300 sqm",
  //   imageSrc: "/project-crescent-learning-centre.png",
  //   imageAlt: "Oval learning centre with a deep shaded facade",
  //   description:
  //     "Crescent Learning Centre wraps flexible teaching spaces in a distinctive oval frame that provides shade, identity, and a generous civic forecourt.",
  // },
  {
    title: "L5",
    slug: "l5",
    location: "Eko Atlantic, Lagos",
    category: "Residential",
    status: "Completed",
    year: "2026",
    area: "33,500 sqm",
    imageSrc: "/project-harbour-point-residences.png",
    imageAlt: "Waterfront residences glowing beside the marina at dusk",
    description:
      "Harbour Point Residences creates a layered waterside silhouette through expansive terraces, planted balconies, and direct connections to the marina.",
  },
  {
    title: "Porsche Centre",
    slug: "porsche-centre",
    location: "Lagos",
    category: "Commercial",
    status: "Completed",
    year: "2010",
    area: "Not specified",
    imageSrc: "/work-porsche-centre.jpg",
    imageAlt: "Porsche Centre Lagos showroom illuminated at dusk",
    description:
      "West Africa's first Porsche Centre pairs a sculpted metallic facade with a transparent showroom, delivered to the brand's international corporate identity standards.",
  },
];
