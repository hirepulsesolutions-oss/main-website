import type { MetadataRoute } from "next";
import { PAGES } from "@/lib/seo";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.map((p) => ({
    url: `${SITE.url}${p.path === "/" ? "" : p.path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: p.priority,
  }));
}
