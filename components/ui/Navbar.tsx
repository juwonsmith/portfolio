"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
          scrolled
            ? "glass border border-white/10 backdrop-blur-xl"
            : "border border-transparent"
        }`}
      >
        <a href="#top" className="font-display text-lg font-bold tracking-tight">
          {site.initials}
          <span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="transition-colors hover:text-white"
                data-cursor
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          <div className="hidden items-center gap-4 text-sm text-white/60 sm:flex">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                data-cursor
                className="transition-colors hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </div>

          <a
            href="#contact"
            data-cursor
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink transition-transform hover:scale-105"
          >
            Let&apos;s talk
          </a>
        </div>
      </nav>
    </header>
  );
}
