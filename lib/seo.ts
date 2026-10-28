import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getProfile, getProjects, type Locale } from "@/lib/data";

export const siteUrl = new URL(process.env.SITE_URL || "https://hernansolano.me");
export const isIndexable = process.env.SITE_INDEXABLE === "true" && process.env.VERCEL_ENV !== "preview";
export const pagePaths = { home: "", about: "/about", projects: "/projects", contact: "/contact" } as const;
type PageName = keyof typeof pagePaths;

export async function getProjectMetadata(locale: string, slug: string): Promise<Metadata> {
  if (!hasLocale(routing.locales, locale)) notFound();
  const project = getProjects(locale).find((item) => item.id === slug);
  if (!project) notFound();
  const base = await getPageMetadata(locale, "projects");
  const path = `/projects/${project.id}`;
  const title = `${project.title} | ${getProfile(locale).name}`;
  return {
    ...base,
    title: { absolute: title },
    description: project.description,
    alternates: { canonical: localizedUrl(locale, path), languages: languageAlternates(path) },
    openGraph: { ...base.openGraph, title, description: project.description, url: localizedUrl(locale, path) },
    twitter: { ...base.twitter, title, description: project.description },
  };
}

export function localizedUrl(locale: Locale, path = ""): string {
  return new URL(`/${locale}${path}`, siteUrl).toString();
}

export function languageAlternates(path: string): Record<string, string> {
  return {
    es: localizedUrl("es", path),
    en: localizedUrl("en", path),
    "x-default": localizedUrl(routing.defaultLocale, path),
  };
}

export async function getPageMetadata(locale: string, page: PageName): Promise<Metadata> {
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const profile = getProfile(locale);
  const title = page === "home" ? t("homeTitle") : `${t(`${page}Title`)} | ${profile.name}`;
  const description = t(`${page}Description`);
  const url = localizedUrl(locale, pagePaths[page]);

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(pagePaths[page]),
    },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: profile.name,
      locale: locale === "es" ? "es_PA" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_PA",
      images: [{ url: localizedUrl(locale, "/opengraph-image"), width: 1200, height: 630, alt: profile.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: localizedUrl(locale, "/opengraph-image"), alt: profile.name }],
    },
  };
}
