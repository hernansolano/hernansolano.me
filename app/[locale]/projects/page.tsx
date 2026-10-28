import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/data";
import { getPageMetadata } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import { ProjectCard } from "@/components/ProjectCard";
import { ContactSection } from "@/components/ContactSection";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return getPageMetadata((await params).locale, "projects");
}
export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Projects");
  return (
    <>
      <div className="shell">
        <header className="page-heading"><h1>{t("title")}</h1><p className="page-description">{t("description")}</p></header>
        <section className="selected-projects project-index" aria-label={t("title")}>
          {getProjects(locale).map((project) => <ProjectCard project={project} locale={locale} headingLevel={2} key={project.id} />)}
        </section>
      </div>
      <ContactSection locale={locale} />
    </>
  );
}
