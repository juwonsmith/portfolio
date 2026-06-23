"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { scrollState } from "@/lib/scrollStore";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const squash = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (scrollState.reducedMotion) return;

    // gsap owns the transform, so center via xPercent/yPercent (not Tailwind)
    gsap.set([ring.current, dot.current], { xPercent: -50, yPercent: -50 });

    const xDot = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const yDot = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const xRing = gsap.quickTo(ring.current, "x", { duration: 0.4, ease: "power3" });
    const yRing = gsap.quickTo(ring.current, "y", { duration: 0.4, ease: "power3" });
    // squash lives on an inner layer so it never collides with the hover scale
    const sx = gsap.quickTo(squash.current, "scaleX", { duration: 0.3, ease: "power3" });
    const sy = gsap.quickTo(squash.current, "scaleY", { duration: 0.3, ease: "power3" });
    const rot = gsap.quickTo(squash.current, "rotation", { duration: 0.3, ease: "power3" });

    let lastX = 0,
      lastY = 0,
      lastT = performance.now(),
      ema = 0;
    const hovering = { current: false };

    const move = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(now - lastT, 1);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      ema = ema * 0.8 + (Math.sqrt(dx * dx + dy * dy) / dt) * 0.2;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;

      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);

      if (!hovering.current) {
        const stretch = Math.min(ema * 0.18, 0.4);
        sx(1 + stretch);
        sy(1 - stretch * 0.6);
        rot((Math.atan2(dy, dx) * 180) / Math.PI);
      }
    };

    const grow = () => {
      hovering.current = true;
      gsap.to(squash.current, { scaleX: 1, scaleY: 1, duration: 0.2 });
      gsap.to(ring.current, { scale: 1.8, opacity: 0.6, duration: 0.3, overwrite: "auto" });
    };
    const shrink = () => {
      hovering.current = false;
      gsap.to(ring.current, { scale: 1, opacity: 1, duration: 0.3, overwrite: "auto" });
    };
    const viewEnter = (e: Event) => {
      hovering.current = true;
      setLabel((e.currentTarget as HTMLElement).getAttribute("data-cursor-label") || "View");
      gsap.to(squash.current, { scaleX: 1, scaleY: 1, duration: 0.2 });
      gsap.to(ring.current, { scale: 4.2, opacity: 1, duration: 0.35, ease: "power3.out", overwrite: "auto" });
      gsap.to(dot.current, { opacity: 0, duration: 0.2 });
    };
    const viewLeave = () => {
      hovering.current = false;
      setLabel(null);
      gsap.to(ring.current, { scale: 1, opacity: 1, duration: 0.35, overwrite: "auto" });
      gsap.to(dot.current, { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", move);
    document.body.classList.add("custom-cursor");

    const hoverEls = document.querySelectorAll("a, button, [data-cursor]");
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });
    const viewEls = document.querySelectorAll("[data-view], [data-cursor-label]");
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
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-8 w-8 md:block"
      >
        <div
          ref={squash}
          className="flex h-full w-full items-center justify-center rounded-full border border-accent/70 bg-accent/5 backdrop-blur-sm"
        >
          {label && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-white">
              {label}
            </span>
          )}
        </div>
      </div>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-1.5 w-1.5 rounded-full bg-accent md:block"
      />
    </>
  );
}
