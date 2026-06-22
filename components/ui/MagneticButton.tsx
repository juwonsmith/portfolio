"use client";

import { useRef } from "react";
import { gsap } from "gsap";

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

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    gsap.to(el, { x, y, duration: 0.4, ease: "power3.out" });
  };

  const onLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor
      className={`inline-flex items-center justify-center rounded-full will-change-transform ${className}`}
    >
      {children}
    </a>
  );
}
