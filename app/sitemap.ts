import type { MetadataRoute } from "next";
import { defaultCaseCmsItems } from "@/src/config/caseCms";
import { getDefaultContentTopics, getPublishedContentTopics } from "@/src/lib/contentTopics";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "https://suguan-geo-site.netlify.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/about", "/services", "/cases", "/articles", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8
  }));

  const caseRoutes = defaultCaseCmsItems
    .filter((item) => item.isPublished)
    .map((item) => ({
      url: `${siteUrl}/cases/${item.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75
    }));

  const articleRoutes = getPublishedContentTopics(getDefaultContentTopics()).map((article) => ({
    url: `${siteUrl}/articles/${article.slug}`,
    lastModified: article.updatedAt ? new Date(article.updatedAt) : now,
    changeFrequency: "monthly" as const,
    priority: 0.7
  }));

  return [...staticRoutes, ...caseRoutes, ...articleRoutes];
}
