import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Locale, Project } from "@/lib/data";

export async function ProjectPreview({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "Preview" });

  if (project.imagePath) {
    return (
      <div className="project-image">
        <Image
          src={project.imagePath}
          alt={project.title}
          fill
          sizes="(max-width: 760px) 100vw, 1120px"
        />
      </div>
    );
  }

  return (
    <div className="project-cover" aria-hidden="true">
      <div className="project-cover-meta">
        <span>{project.category}</span>
        <span>{project.year}</span>
      </div>
      <p className="project-cover-title">{project.title}</p>
      <div className="project-cover-footer">
        <span>{project.techStack.slice(0, 3).join(" / ")}</span>
        <span>{t("project")}</span>
      </div>
    </div>
  );
}
