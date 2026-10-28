"use client";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const links = [{ href: "/", label: t("home") }, { href: "/projects", label: t("projects") }, { href: "/about", label: t("about") }, { href: "/contact", label: t("contact") }];
  return (
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === "Escape" && isOpen) { setIsOpen(false); menuButton.current?.focus(); }
    }}>
      <div className="shell nav-row">
        <Link
          href="/"
          className="wordmark"
          aria-label={t("homeLabel")}
          onClick={() => setIsOpen(false)}
        >hs<span>.</span></Link>
        <nav className="desktop-navigation" aria-label={t("mainNavigation")}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={(pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"))) ? "page" : undefined}
            >{link.label}</Link>
          ))}
        </nav>
        <div className="nav-controls">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            ref={menuButton}
            className="icon-button mobile-menu-toggle"
            aria-label={isOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >{isOpen ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 8h16M4 16h16" />}</svg>
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        className="mobile-navigation shell"
        aria-label={t("mobileNavigation")}
        hidden={!isOpen}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={(pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"))) ? "page" : undefined}
            onClick={() => setIsOpen(false)}
          >{link.label}</Link>
        ))}
      </nav>
    </header>
  );
}
