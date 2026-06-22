"use client";

import { site } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import SplitReveal from "@/components/ui/SplitReveal";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative flex min-h-screen flex-col justify-center px-6 py-32 md:px-12"
    >
      <div className="mx-auto w-full max-w-6xl text-center">
        <Reveal>
          <p className="mb-8 text-sm uppercase tracking-[0.3em] text-white/50">
            Got a project in mind?
          </p>
        </Reveal>

        <a
          href={`mailto:${site.email}`}
          className="inline-block font-display text-[12vw] font-bold leading-none tracking-tightest transition-colors hover:text-accent md:text-[8vw]"
        >
          <SplitReveal text="Let's talk" />
        </a>

        <Reveal className="mt-14 flex justify-center">
          <MagneticButton
            href={`mailto:${site.email}`}
            className="bg-accent px-8 py-4 text-sm font-medium text-ink"
          >
            {site.email}
          </MagneticButton>
        </Reveal>

        <Reveal className="mt-20 flex flex-wrap items-center justify-center gap-8 text-sm text-white/50">
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
              data-cursor
            >
              {s.label}
            </a>
          ))}
        </Reveal>
      </div>

      <footer className="mx-auto mt-32 flex w-full max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/40 md:flex-row">
        <span>
          © {site.name} — {site.location}
        </span>
        <span>Built with Next.js, Three.js & GSAP</span>
      </footer>
    </section>
  );
}
