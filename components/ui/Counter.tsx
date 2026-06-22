"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  to: number;
  suffix?: string;
  className?: string;
};

export default function Counter({ to, suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    const obj = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: to,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => setValue(Math.round(obj.v)),
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [to]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
