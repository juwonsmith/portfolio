"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/scrollStore";
import { useTilt } from "@/lib/useTilt";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useTilt();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = document.documentElement;

    // keep capability flags live (toggling the OS setting updates instantly)
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cp = window.matchMedia("(pointer: coarse)");
    const syncRM = () => {
      scrollState.reducedMotion = rm.matches;
      root.toggleAttribute("data-reduced-motion", rm.matches);
    };
    const syncCP = () => {
      scrollState.coarsePointer = cp.matches;
    };
    syncRM();
    syncCP();
    rm.addEventListener("change", syncRM);
    cp.addEventListener("change", syncCP);

    // reduced motion: native scroll, no smooth/scrub layer at all
    if (rm.matches) {
      root.style.setProperty("--scroll-skew", "0deg");
      root.style.setProperty("--scroll-energy", "0");
      ScrollTrigger.refresh();
      return () => {
        rm.removeEventListener("change", syncRM);
        cp.removeEventListener("change", syncCP);
      };
    }

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });

    lenis.on("scroll", (e: Lenis) => {
      const v = e.velocity || 0;
      scrollState.progress = e.progress || 0;
      scrollState.velocity = v;
      root.style.setProperty("--scroll-progress", String(e.progress || 0));
      root.style.setProperty(
        "--scroll-skew",
        `${Math.max(-6, Math.min(6, v * 0.35))}deg`
      );
      root.style.setProperty(
        "--scroll-energy",
        String(Math.min(Math.abs(v) * 0.05, 1))
      );
      ScrollTrigger.update();
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      rm.removeEventListener("change", syncRM);
      cp.removeEventListener("change", syncCP);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
