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
      <section className="hero shell">
        <p className="eyebrow">{t("location")}</p>
        <h1>{profile.name}</h1>
        <p className="hero-title">{profile.title}</p>
        <p className="hero-description">{profile.description}</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/projects">
            {t("viewWork")} <span aria-hidden="true">↗</span>
          </Link>
          {profile.resumePath && (
            <a className="text-link" href={profile.resumePath} download>
              {t("downloadCV")} <span aria-hidden="true">↓</span>
            </a>
          )}
          <Link className="text-link" href="/contact">{t("contact")}</Link>
        </div>
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

      {experience && (
        <section
          className="recent-experience shell"
          aria-labelledby="experience-title"
        >
          <div>
            <h2 id="experience-title">{t("experienceTitle")}</h2>
            <Link className="text-link" href="/about">
              {t("about")} <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <article>
            <p className="experience-date">{experience.duration}</p>
            <h3>{experience.company}</h3>
            <p className="experience-role">{experience.role}</p>

          </article>
        </section>
      )}
      <ContactSection locale={locale} />
    </>
  );
}
