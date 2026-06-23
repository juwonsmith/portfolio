"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/scrollStore";

type Props = {
  text: string;
  className?: string;
  delay?: number;
};

export default function SplitReveal({ text, className, delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const inners = el.querySelectorAll(".word-inner");

    if (scrollState.reducedMotion) {
      gsap.set(inners, { yPercent: 0 });
      return;
    }

    const coarse = scrollState.coarsePointer;
    const ctx = gsap.context(() => {
      gsap.from(inners, {
        yPercent: 110,
        duration: 1,
        delay,
        ease: "power4.out",
        stagger: coarse ? 0.03 : 0.06,
        scrollTrigger: { trigger: el, start: coarse ? "top 90%" : "top 85%" },
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
          {i < text.split(" ").length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
