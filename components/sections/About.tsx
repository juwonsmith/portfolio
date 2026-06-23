"use client";

import { site, skills, stats } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";

export default function About() {
  return (
    <section id="about" className="relative px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto grid w-full max-w-6xl gap-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Reveal>
            <p className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-white/50">
              <span className="h-px w-10 bg-accent" />
              About
            </p>
          </Reveal>
        </div>

        <div className="md:col-span-8">
          <Reveal>
            <p className="font-display text-xl font-medium leading-snug tracking-tight md:text-3xl">
              {site.about}
            </p>
          </Reveal>

          {/* animated stats */}
          <Reveal className="mt-16 grid grid-cols-3 gap-6 border-y border-white/10 py-10" stagger>
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-4xl font-bold tracking-tight text-accent md:text-6xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-xs uppercase tracking-wider text-white/50 md:text-sm">
                  {s.label}
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-16" stagger>
            <div className="mb-8 text-sm uppercase tracking-[0.3em] text-white/40">
              Toolbox
            </div>
            <ul className="flex flex-wrap gap-3">
              {skills.map((s) => (
                <li
                  key={s}
                  data-cursor
                  className="glass rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:text-white"
                >
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
