"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  text: string;
  className?: string;
  /** delay before the stagger starts */
  delay?: number;
};

// Splits text into words (each clipped) and reveals them with a staggered
// upward slide when scrolled into view. No paid GSAP plugin needed.
export default function SplitReveal({ text, className, delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll(".word-inner"), {
        yPercent: 110,
        duration: 1,
        delay,
        ease: "power4.out",
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    }, el);

    return () => ctx.revert();
  }, [text, delay]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden align-bottom"
        >
          <span className="word-inner inline-block">{word}</span>
          {i < text.split(" ").length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
