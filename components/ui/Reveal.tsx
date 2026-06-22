"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** vertical offset to animate from */
  y?: number;
  delay?: number;
  /** stagger direct children instead of the wrapper itself */
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

    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(el.children) : el;
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 1,
        delay,
        ease: "power3.out",
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
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
