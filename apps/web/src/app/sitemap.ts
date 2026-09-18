import { MetadataRoute } from "next";
import { getWorkProjectSlugs } from "@/sanity/data/projects";

const BASE_URL = "https://ecadarchitects.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projectSlugs = await getWorkProjectSlugs();

  const dynamicRoutes = projectSlugs.map(({ slug }) => ({
    url: `${BASE_URL}/work/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticRoutes = ["", "/about", "/contact", "/culture", "/process", "/team", "/work"].map(
    (route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.9,
    })
  );

  return [...staticRoutes, ...dynamicRoutes];
}
