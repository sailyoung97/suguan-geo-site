import type { MetadataRoute } from "next";
import { siteUrl } from "@/src/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/admin/*", "/login", "/.netlify/functions/"]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
