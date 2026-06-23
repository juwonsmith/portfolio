"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/scrollStore";

type Props = {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  stagger?: boolean;
};

export default function Reveal({
  children,
  className,
  y = 40,
  delay = 0,
  stagger = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const targets = stagger ? Array.from(el.children) : el;

    // reduced motion: show everything instantly, no scroll animation
    if (scrollState.reducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: "transform" });
      return;
    }

    const coarse = scrollState.coarsePointer;
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y: coarse ? 24 : y, // less travel on tall phone viewports
        opacity: 0,
        duration: 1,
        delay,
        ease: "power3.out",
        stagger: stagger ? (coarse ? 0.06 : 0.12) : 0,
        scrollTrigger: { trigger: el, start: coarse ? "top 90%" : "top 85%" },
      });
    }, el);

    return () => ctx.revert();
  }, [y, delay, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
