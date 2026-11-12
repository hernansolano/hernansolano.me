import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getExperience, getProfile, getProjects } from "@/lib/data";
import { getPageMetadata } from "@/lib/seo";
import { Link, routing } from "@/i18n/routing";
import { ProjectCard } from "@/components/ProjectCard";
import { ContactSection } from "@/components/ContactSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return getPageMetadata((await params).locale, "home");
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const profile = getProfile(locale);
  const projects = getProjects(locale).slice(0, 2);
  const experience = getExperience(locale)[0];
  const t = await getTranslations("Home");

  return (
    <>
      <section className="hero shell" aria-labelledby="hero-heading">
        <div className="hero-intro">
          <p className="hero-name">{profile.name}</p>
          <h1 id="hero-heading">
            {t("headline")} <span>{t("headlineSecondary")}</span>
          </h1>
          <p className="hero-description">{t("intro")}</p>
          <p className="hero-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {t("location")}
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              {t("viewWork")} <span aria-hidden="true">↓</span>
            </a>
            {profile.resumePath && (
              <a className="button button-secondary" href={profile.resumePath} download>
                {t("downloadCV")} <span aria-hidden="true">↓</span>
              </a>
            )}
            <Link className="text-link" href="/contact">
              {t("contact")} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        {experience && (
          <aside className="hero-experience" aria-labelledby="experience-title">
            <p className="eyebrow">{t("experienceTitle")}</p>
            <h2 id="experience-title">{experience.company}</h2>
            <p className="experience-role">{experience.role}</p>
            <p className="hero-experience-description">{experience.responsibilities[0]}</p>
            <p className="experience-date">{experience.duration}</p>
            <Link className="text-link" href="/about">
              {t("about")} <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        )}
      </section>

      {projects.length > 0 && (
        <section
          id="work"
          className="work-section shell"
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <h2 id="work-title">{t("workTitle")}</h2>
            <Link className="text-link" href="/projects">
              {t("allProjects")} <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="selected-projects">
            {projects.map((project) => (
              <ProjectCard project={project} locale={locale} key={project.id} />
            ))}
          </div>
        </section>
      )}

      <ContactSection locale={locale} />
    </>
  );
}
