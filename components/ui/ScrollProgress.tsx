"use client";

// Thin top progress bar. Driven entirely by CSS vars SmoothScroll updates,
// so it costs nothing in React. Brightens/glows with scroll momentum.
export default function ScrollProgress() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-white/5">
      <div
        className="h-full origin-left bg-gradient-to-r from-accent to-accent-glow"
        style={{
          transform: "scaleX(var(--scroll-progress, 0))",
          filter:
            "brightness(calc(1 + var(--scroll-energy, 0) * 0.8)) saturate(calc(1 + var(--scroll-energy, 0) * 0.5))",
          boxShadow:
            "0 0 calc(var(--scroll-energy, 0) * 12px) rgba(122, 162, 255, calc(var(--scroll-energy, 0) * 0.8))",
        }}
      />
    </div>
  );
}
