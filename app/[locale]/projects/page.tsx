import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/data";
import { getPageMetadata } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import { ProjectPreview } from "@/components/ProjectPreview";
import { ContactSection } from "@/components/ContactSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return getPageMetadata((await params).locale, "projects");
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const projects = getProjects(locale);
  const t = await getTranslations("Projects");

  return (
    <>
      <div className="shell">
        <section className="page-heading">
          <h1>{t("title")}</h1>
          <p className="page-description">{t("description")}</p>
        </section>

        <div className="project-list">
          {projects.map((project) => (
            <article id={project.id} key={project.id} className="case-study">
              <div className="case-meta">
                <span>{project.category}</span>
                {project.status && project.status !== project.category && (
                  <span>{project.status}</span>
                )}
              </div>
              <ProjectPreview project={project} locale={locale} />
              <div className="case-heading">
                <div>
                  <h2>{project.title}</h2>
                  <p className="muted">{project.description}</p>
                </div>
                <div className="case-links">
                  {project.githubLink && (
                    <a
                      className="button button-secondary"
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("github")} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {project.liveLink && (
                    <a
                      className="button button-primary"
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("live")} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </div>
              <ul className="tech-list" aria-label={t("technologies")}>
                {project.techStack.map((tech) => <li key={tech}>{tech}</li>)}
              </ul>
              {(project.challenge || project.approach || project.outcome) && (
                <div className="case-details">
                  {project.challenge && (
                    <div>
                      <h3>{t("challenge")}</h3>
                      <p>{project.challenge}</p>
                    </div>
                  )}
                  {project.approach && (
                    <div>
                      <h3>{t("approach")}</h3>
                      <p>{project.approach}</p>
                    </div>
                  )}
                  {project.outcome && (
                    <div>
                      <h3>{t("outcome")}</h3>
                      <p>{project.outcome}</p>
                    </div>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
      <ContactSection locale={locale} />
    </>
  );
}
