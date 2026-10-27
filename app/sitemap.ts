import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { languageAlternates, localizedUrl, pagePaths } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    Object.values(pagePaths).map((path) => ({
      url: localizedUrl(locale, path),
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
