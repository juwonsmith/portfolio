"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { scrollState } from "@/lib/scrollStore";
import { tap } from "@/lib/haptics";

type Props = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  strength?: number;
};

export default function MagneticButton({
  children,
  href,
  className = "",
  strength = 0.4,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const glow = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (scrollState.reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    // pull harder toward a fast-approaching cursor
    const s = strength * (1 + Math.min(scrollState.pointerSpeed * 0.5, 0.6));
    const x = Math.max(-rect.width * 0.5, Math.min(rect.width * 0.5, relX * s));
    const y = Math.max(-rect.height * 0.5, Math.min(rect.height * 0.5, relY * s));
    gsap.to(el, { x, y, duration: 0.4, ease: "power3.out" });
    if (glow.current)
      gsap.to(glow.current, { x: relX * 0.6, y: relY * 0.6, opacity: 0.5, duration: 0.4 });
  };

  const onLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.35)" });
    if (glow.current) gsap.to(glow.current, { x: 0, y: 0, opacity: 0, duration: 0.5 });
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onTouchStart={() => tap()}
      data-cursor
      className={`relative inline-flex items-center justify-center rounded-full will-change-transform ${className}`}
    >
      <span
        ref={glow}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-accent/40 opacity-0 blur-xl"
      />
      {children}
    </a>
  );
}
