"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ProjectScreenshot } from "@/lib/data";

export function ProjectGallery({ screenshots }: { screenshots: ProjectScreenshot[] }) {
  const [active, setActive] = useState(0);
  const t = useTranslations("Projects");
  const shot = screenshots[active];
  if (!shot) return null;

  return (
    <section className="project-gallery" aria-label={t("gallery")}>
      <figure>
        <a className="gallery-image" href={shot.src} target="_blank" rel="noopener noreferrer" aria-label={t("openScreenshot")}>
          <Image src={shot.src} alt={shot.alt} fill sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1176px) calc(100vw - 96px), 1080px" />
          <span className="gallery-expand">{t("openScreenshot")} <span aria-hidden="true">↗</span></span>
        </a>
        <figcaption className="gallery-caption" aria-live="polite" aria-atomic="true">
          <span>{shot.caption || shot.alt}</span>
          <span>{active + 1} / {screenshots.length}</span>
        </figcaption>
      </figure>
      {screenshots.length > 1 && (
        <div className="gallery-thumbnails" role="group" aria-label={t("chooseScreenshot")}>
          {screenshots.map((image, index) => (
            <button key={image.src} type="button" aria-label={t("screenshot", { number: index + 1, description: image.alt })} aria-pressed={index === active} onClick={() => setActive(index)}>
              <Image src={image.src} alt="" fill sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
