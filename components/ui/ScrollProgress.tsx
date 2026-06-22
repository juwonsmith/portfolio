"use client";

// Thin top progress bar. Driven entirely by the --scroll-progress CSS var
// that SmoothScroll updates, so it costs nothing in React.
export default function ScrollProgress() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-white/5">
      <div
        className="h-full origin-left bg-gradient-to-r from-accent to-accent-glow"
        style={{ transform: "scaleX(var(--scroll-progress, 0))" }}
      />
    </div>
  );
}
