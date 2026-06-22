"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const xDot = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const yDot = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const xRing = gsap.quickTo(ring.current, "x", { duration: 0.4, ease: "power3" });
    const yRing = gsap.quickTo(ring.current, "y", { duration: 0.4, ease: "power3" });

    const move = (e: MouseEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const grow = () => gsap.to(ring.current, { scale: 1.8, opacity: 0.6, duration: 0.3 });
    const shrink = () => gsap.to(ring.current, { scale: 1, opacity: 1, duration: 0.3 });

    const viewEnter = () => {
      setLabel("View");
      gsap.to(ring.current, { scale: 4.5, opacity: 1, duration: 0.35, ease: "power3.out" });
      gsap.to(dot.current, { opacity: 0, duration: 0.2 });
    };
    const viewLeave = () => {
      setLabel(null);
      gsap.to(ring.current, { scale: 1, opacity: 1, duration: 0.35 });
      gsap.to(dot.current, { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", move);
    document.body.classList.add("custom-cursor");

    const hoverEls = document.querySelectorAll("a, button, [data-cursor]");
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    const viewEls = document.querySelectorAll("[data-view]");
    viewEls.forEach((el) => {
      el.addEventListener("mouseenter", viewEnter);
      el.addEventListener("mouseleave", viewLeave);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      document.body.classList.remove("custom-cursor");
      hoverEls.forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
      viewEls.forEach((el) => {
        el.removeEventListener("mouseenter", viewEnter);
        el.removeEventListener("mouseleave", viewLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent/70 bg-accent/5 backdrop-blur-sm md:flex"
      >
        {label && (
          <span className="text-[3px] font-medium uppercase tracking-wider text-white">
            {label}
          </span>
        )}
      </div>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent md:block"
      />
    </>
  );
}
