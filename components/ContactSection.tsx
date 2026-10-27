import { getTranslations } from "next-intl/server";
import { getProfile, type Locale } from "@/lib/data";

export async function ContactSection({ locale }: { locale: Locale }) {
  const profile = getProfile(locale);
  const t = await getTranslations({ locale, namespace: "Contact" });
  return (
    <section
      id="contact"
      className="contact-section shell"
      aria-labelledby="contact-title"
    >
      <div>
        <h2 id="contact-title">{t("title")}</h2>
        <p className="muted contact-description">{t("description")}</p>
      </div>
      <div className="contact-links">
        {profile.email && (
          <a className="contact-email" href={"mailto:" + profile.email}>{profile.email}<span aria-hidden="true">↗</span></a>
        )}
        <div className={profile.email ? "social-links" : "social-links social-links-primary"}>
          {profile.social.github && (
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
            >GitHub <span aria-hidden="true">↗</span></a>
          )}
          {profile.social.linkedin && (
            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >LinkedIn <span aria-hidden="true">↗</span></a>
          )}
        </div>
      </div>
    </section>
  );
}
