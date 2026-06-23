"use client";

import { site } from "@/lib/site";
import MagneticButton from "@/components/ui/MagneticButton";
import Scramble from "@/components/ui/Scramble";

export default function Hero() {
  const [firstName, ...restName] = site.name.split(" ");
  const lastName = restName.join(" ");

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center px-6 md:px-12"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="overflow-hidden">
          <p
            data-hero-reveal
            className="mb-6 flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-white/50"
          >
            <span className="h-px w-10 bg-accent" />
            <Scramble text={site.role} />
          </p>
        </div>

        <h1 className="font-display text-[16vw] font-bold leading-[0.9] tracking-tightest md:text-[9vw]">
          <span className="block overflow-hidden">
            <span data-hero-reveal className="block">
              <Scramble text={firstName} delay={2000} revealSpeed={0.05} />
            </span>
          </span>
          {lastName && (
            <span className="block overflow-hidden">
              <span data-hero-reveal className="block text-white/40">
                <Scramble text={lastName} delay={2150} revealSpeed={0.05} />
              </span>
            </span>
          )}
        </h1>

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="overflow-hidden">
            <p
              data-hero-reveal
              className="max-w-md text-lg leading-relaxed text-white/70"
            >
              {site.tagline}
            </p>
          </div>

          <div data-hero-reveal className="flex gap-4">
            <MagneticButton
              href="#work"
              className="border border-white/20 px-7 py-4 text-sm font-medium text-white transition-colors hover:bg-white hover:text-ink"
            >
              View work
            </MagneticButton>
            <MagneticButton
              href="#contact"
              className="bg-accent px-7 py-4 text-sm font-medium text-ink transition-opacity hover:opacity-90"
            >
              Get in touch
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/40">
        <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-10 w-px animate-pulse bg-white/30" />
      </div>
    </section>
  );
}
