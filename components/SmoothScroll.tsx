"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/scrollStore";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    const root = document.documentElement;
    lenis.on("scroll", (e: Lenis) => {
      scrollState.progress = e.progress || 0;
      scrollState.velocity = e.velocity || 0;
      // expose to CSS for the progress bar + velocity-driven skew
      root.style.setProperty("--scroll-progress", String(e.progress || 0));
      const skew = Math.max(-6, Math.min(6, (e.velocity || 0) * 0.35));
      root.style.setProperty("--scroll-skew", `${skew}deg`);
      ScrollTrigger.update();
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // make sure triggers measure correctly once mounted
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
