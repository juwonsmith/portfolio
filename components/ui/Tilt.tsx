"use client";

import { useRef } from "react";
import { gsap } from "gsap";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** max rotation in degrees */
  max?: number;
};

export default function Tilt({ children, className = "", max = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
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
  };

  const onLeave = () => {
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
