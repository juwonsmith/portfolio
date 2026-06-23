"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/site";
import Tilt from "@/components/ui/Tilt";
import SplitReveal from "@/components/ui/SplitReveal";

export default function Projects() {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = section.current;
    const tr = track.current;
    if (!sec || !tr) return;
    gsap.registerPlugin(ScrollTrigger);

    // Horizontal pinned scroll on desktop only. matchMedia auto-cleans when
    // the viewport drops below the breakpoint, restoring normal vertical flow.
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const distance = () => tr.scrollWidth - window.innerWidth;
      const tween = gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => tween.kill();
    });

    // Mobile: no hover + no horizontal scroll, so make the vertical scroll feel
    // alive — stagger each card in and fade its live preview in as it arrives.
    mm.add("(max-width: 767px)", () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
          gsap.from(card.querySelectorAll(".reveal-item"), {
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: card, start: "top 82%" },
          });
          const img = card.querySelector<HTMLElement>(".preview-img");
          if (img) {
            // toggle opacity via the class's CSS transition (smooth, no conflict)
            ScrollTrigger.create({
              trigger: card,
              start: "top 62%",
              onEnter: () => (img.style.opacity = "1"),
              onLeaveBack: () => (img.style.opacity = "0"),
            });
          }
        });
      }, sec);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="work" ref={section} className="relative overflow-hidden">
      <div
        ref={track}
        className="flex flex-col md:h-screen md:flex-row md:flex-nowrap md:items-center"
      >
        {/* intro panel */}
        <div className="flex w-full shrink-0 flex-col justify-center px-6 pt-32 md:min-w-[42vw] md:px-16 md:pt-0">
          <span className="mb-6 flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-white/50">
            <span className="h-px w-10 bg-accent" />
            {projects.length} projects
          </span>
          <h2 className="font-display text-6xl font-bold leading-[0.95] tracking-tightest md:text-8xl">
            <SplitReveal text="Selected" className="block" />
            <SplitReveal text="Work" className="block text-white/40" delay={0.1} />
          </h2>
          <p className="mt-8 hidden max-w-xs text-white/50 md:block">
            Scroll to move through the work →
          </p>
        </div>

        {/* project panels */}
        {projects.map((p, i) => {
          const preview = p.links.find((l) => l.label === "Live")?.href;
          return (
          <article
            key={p.id}
            className="project-card group flex w-full shrink-0 items-center px-6 py-16 md:min-w-[66vw] md:px-16 md:py-0 lg:min-w-[54vw]"
          >
            <div className="grid w-full items-center gap-8 md:grid-cols-2 md:gap-12">
              {/* art */}
              <Tilt className="reveal-item">
                <div
                  data-view
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10"
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.28),transparent_55%)]" />
                  {preview && (
                    <img
                      src={`https://api.microlink.io/?url=${encodeURIComponent(
                        preview
                      )}&screenshot=true&embed=screenshot.url&viewport.width=1280&viewport.height=900`}
                      alt={`${p.title} preview`}
                      loading="lazy"
                      onError={(e) => {
                        // if the screenshot can't be captured, keep the gradient
                        e.currentTarget.style.display = "none";
                      }}
                      className="preview-img absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 flex items-end p-6">
                    <span className="font-display text-7xl font-bold text-white/20 md:text-8xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </Tilt>

              {/* copy */}
              <div className="reveal-item">
                <div className="mb-4 flex items-center gap-3 text-sm text-white/40">
                  <span className="h-px w-8 bg-white/20" />
                  <span>{p.blurb}</span>
                </div>
                <h3 className="font-display text-4xl font-bold tracking-tight transition-colors group-hover:text-accent md:text-5xl">
                  {p.title}
                </h3>
                <p className="mt-5 max-w-md leading-relaxed text-white/60">
                  {p.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex gap-6">
                  {p.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link inline-flex items-center gap-2 text-sm font-medium text-white"
                    >
                      {l.label}
                      <span className="transition-transform group-hover/link:translate-x-1">
                        →
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}
