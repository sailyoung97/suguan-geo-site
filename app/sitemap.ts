import type { MetadataRoute } from "next";
import { defaultCaseCmsItems } from "@/src/config/caseCms";
import { getDefaultContentTopics, getPublishedContentTopics } from "@/src/lib/contentTopics";
import { siteUrl } from "@/src/config/site";
import { readJsonData } from "@/src/server/jsonStorage";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date("2026-07-02T00:00:00+08:00");
  const [cases, articles] = await Promise.all([
    readJsonData("cases", defaultCaseCmsItems),
    readJsonData("articles", getDefaultContentTopics())
  ]);
  const staticRoutes = ["", "/about", "/services", "/cases", "/articles", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8
  }));

  const caseRoutes = cases
    .filter((item) => item.isPublished)
    .map((item) => ({
      url: `${siteUrl}/cases/${item.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75
    }));

  const articleRoutes = getPublishedContentTopics(articles).map((article) => ({
    url: `${siteUrl}/articles/${article.slug}`,
    lastModified: article.plannedDate ? new Date(`${article.plannedDate}T00:00:00+08:00`) : now,
    changeFrequency: "monthly" as const,
    priority: 0.7
  }));

  return [...staticRoutes, ...caseRoutes, ...articleRoutes];
}
