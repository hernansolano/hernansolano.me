import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { Locale, Project } from "@/lib/data";

export async function ProjectCard({ project, locale, headingLevel = 3 }: { project: Project; locale: Locale; headingLevel?: 2 | 3 }) {
  const t = await getTranslations({ locale, namespace: "Projects" });
  const cover = project.screenshots?.[0];
  const image = cover?.src || project.imagePath;
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article id={project.id} className="project-card">
      <Link className="project-card-link" href={`/projects/${project.id}`}>
        {image && (
          <div className="card-image">
            <Image src={image} alt={cover?.alt || project.title} fill sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1176px) calc((100vw - 96px) / 2), 523px" />
          </div>
        )}
        <div className="card-body">
          <div className="card-meta"><span>{project.category}</span><span>{project.year}</span></div>
          <Heading>{project.title}</Heading>
          <p className="card-description">{project.description}</p>
          <ul className="tech-list" aria-label={t("technologies")}>
            {project.techStack.slice(0, 3).map((tech) => <li key={tech}>{tech}</li>)}
          </ul>
          <span className="card-action">{t("details")}<span aria-hidden="true">↗</span></span>
        </div>
      </Link>
    </article>
  );
}
