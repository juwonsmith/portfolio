"use client";

import { marqueeWords } from "@/lib/site";

// Infinite scrolling strip. Reacts to scroll velocity via the --scroll-skew
// var for a subtle "speed up / lean" feel.
export default function Marquee() {
  const items = [...marqueeWords, ...marqueeWords];

  return (
    <div
      className="relative overflow-hidden border-y border-white/10 py-6"
      style={{ transform: "skewY(calc(var(--scroll-skew, 0deg) * 0.15))" }}
    >
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {items.map((w, i) => (
          <span
            key={i}
            className="font-display text-3xl font-bold uppercase tracking-tight text-white/70 md:text-5xl"
          >
            {w}
            <span className="px-10 text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
