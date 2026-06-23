"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { scrollState } from "@/lib/scrollStore";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // reduced motion: skip the whole intro, reveal content immediately
    if (scrollState.reducedMotion) {
      gsap.set("[data-hero-reveal]", { opacity: 1, yPercent: 0, clearProps: "transform" });
      setDone(true);
      return;
    }

    const obj = { v: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.to(obj, {
        v: 100,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => setCount(Math.round(obj.v)),
      })
        .to(".pre-bar", { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0)
        .to(root.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
          onComplete: () => setDone(true),
        })
        .from(
          "[data-hero-reveal]",
          {
            yPercent: 120,
            opacity: 0,
            duration: 1,
            stagger: 0.08,
            ease: "power4.out",
          },
          "-=0.5"
        );
    });
    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink"
    >
      <div className="font-display text-7xl font-bold tracking-tightest md:text-9xl">
        {count}
        <span className="text-accent">%</span>
      </div>
      <div className="mt-8 h-px w-48 overflow-hidden bg-white/10">
        <div className="pre-bar h-full w-full origin-left scale-x-0 bg-accent" />
      </div>
    </div>
  );
}
