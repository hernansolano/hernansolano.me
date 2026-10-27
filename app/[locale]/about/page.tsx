import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  getProfile,
  getExperience,
  getEducation,
  getSkills,
  getLanguages,
} from "@/lib/data";
import { getPageMetadata } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import { ContactSection } from "@/components/ContactSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return getPageMetadata((await params).locale, "about");
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const profile = getProfile(locale);
  const experiences = getExperience(locale);
  const education = getEducation(locale);
  const skills = getSkills(locale);
  const languages = getLanguages(locale);
  const t = await getTranslations("About");

  return (
    <>
      <div className="shell">
        <section className="page-heading">
          <h1>{t("title")}</h1>
          <p className="page-description">{profile.about}</p>
          {profile.resumePath && (
            <a className="button button-secondary resume-download" href={profile.resumePath} download>
              {t("downloadCV")} <span aria-hidden="true">↓</span>
            </a>
          )}
        </section>

        {experiences.length > 0 && (
          <section className="resume-section">
            <h2>{t("experience")}</h2>
            <div>
              {experiences.map((item) => (
                <article className="resume-item" key={item.company + item.role}>
                  <p className="experience-date">{item.duration}</p>
                  <h3>{item.role}</h3>
                  <p>{item.company}</p>
                  <ul>
                    {item.responsibilities.map((text) => (
                      <li key={text}>{text}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="resume-section">
            <h2>{t("education")}</h2>
            <div>
              {education.map((item) => (
                <article className="resume-item" key={item.institution + item.degree}>
                  <p className="experience-date">{item.duration}</p>
                  <h3>{item.degree}</h3>
                  <p>{item.institution}</p>
                  <p className="muted">{item.details}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {Object.values(skills).some((items) => items.length > 0) && (
          <section className="resume-section">
            <h2>{t("skills")}</h2>
            <div className="skill-groups">
              {(["frontend", "backend", "tools"] as const).map((category) =>
                skills[category].length > 0 && (
                  <div key={category}>
                    <h3>{t(category)}</h3>
                    <ul className="tech-list">
                      {skills[category].map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {languages.length > 0 && (
          <section className="resume-section">
            <h2>{t("languages")}</h2>
            <div>
              {languages.map((item) => (
                <div className="language-row" key={item.language}>
                  <h3>{item.language}</h3>
                  {item.level && <span>{item.level}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <ContactSection locale={locale} />
    </>
  );
}
