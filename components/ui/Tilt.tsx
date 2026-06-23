"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { scrollState } from "@/lib/scrollStore";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** max rotation in degrees */
  max?: number;
};

export default function Tilt({ children, className = "", max = 6 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (scrollState.reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotateY: px * max,
      rotateX: -py * max,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 900,
    });
    if (glare.current) {
      glare.current.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
      glare.current.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
      gsap.to(glare.current, { opacity: 1, duration: 0.3 });
    }
  };

  const onLeave = () => {
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.5)",
    });
    if (glare.current) gsap.to(glare.current, { opacity: 0, duration: 0.4 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
      <div
        ref={glare}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.22), transparent 45%)",
        }}
      />
    </div>
  );
}
