import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, routing } from "@/i18n/routing";
import { getProjects } from "@/lib/data";
import { getProjectMetadata } from "@/lib/seo";
import { ContactSection } from "@/components/ContactSection";
import { ProjectGallery } from "@/components/ProjectGallery";

type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() {
  return getProjects("es").map((project) => ({ slug: project.id }));
}
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getProjectMetadata(locale, slug);
}
export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const projects = getProjects(locale);
  const project = projects.find((item) => item.id === slug);
  if (!project) notFound();
  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length];
  const t = await getTranslations("Projects");
  const screenshots = project.screenshots?.length ? project.screenshots : project.imagePath ? [{ src: project.imagePath, alt: project.title }] : [];
  return (
    <>
      <article className="shell project-detail">
        <header className="page-heading">
          <Link href="/projects" className="text-link breadcrumb"><span aria-hidden="true">←</span> {t("back")}</Link>
          <div className="detail-meta"><span>{project.category}</span><span>{project.year}</span>{project.status !== project.category && <span>{project.status}</span>}</div>
          <h1>{project.title}</h1>
          <p className="page-description">{project.description}</p>
          <ul className="tech-list" aria-label={t("technologies")}>
            {project.techStack.map((tech) => <li key={tech}>{tech}</li>)}
          </ul>
          {(project.githubLink || project.liveLink) && (
            <div className="case-links">
              {project.liveLink && <a href={project.liveLink} className="button button-primary" target="_blank" rel="noopener noreferrer">{t("live")} <span aria-hidden="true">↗</span></a>}
              {project.githubLink && <a href={project.githubLink} className="button button-secondary" target="_blank" rel="noopener noreferrer">{t("github")} <span aria-hidden="true">↗</span></a>}
            </div>
          )}
        </header>
        {screenshots.length > 0 && <ProjectGallery screenshots={screenshots} />}
        <div className="project-story">
          {(["challenge", "approach", "outcome"] as const).map((key, index) => project[key] && (
            <section className="story-section" key={key}>
              <h2><span aria-hidden="true">0{index + 1}</span>{t(key)}</h2><p>{project[key]}</p>
            </section>
          ))}
        </div>
        {nextProject.id !== project.id && (
          <Link href={"/projects/" + nextProject.id} className="next-project">
            <span><span className="eyebrow">{t("next")}</span><span className="next-project-title">{nextProject.title}</span></span><span aria-hidden="true">↗</span>
          </Link>
        )}
      </article>
      <ContactSection locale={locale} />
    </>
  );
}
