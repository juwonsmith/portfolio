// A tiny module-level store shared between the DOM (Lenis/GSAP), the WebGL
// scene (R3F useFrame), and CSS — without triggering React re-renders.
// It is the single "heartbeat" every reactive effect reads from.

function mql(query: string): boolean {
  return typeof window !== "undefined" && window.matchMedia(query).matches;
}

export const scrollState = {
  /** 0 → 1 across the whole page */
  progress: 0,
  /** scroll velocity from Lenis */
  velocity: 0,

  /** accessibility / capability flags (live-updated in SmoothScroll) */
  reducedMotion: mql("(prefers-reduced-motion: reduce)"),
  coarsePointer: mql("(pointer: coarse)"),

  /** the shared intensity, 0 (calm) → 1 (surging). Integrated in Scene's EnergyBus. */
  energy: 0,
  /** normalized pointer position, -1 → 1 (fed by a global listener, since the
   *  canvas is pointer-events-none and R3F's own pointer never updates) */
  pointer: { x: 0, y: 0 },
  /** pointer/finger move speed (normalized units / sec) */
  pointerSpeed: 0,

  /** click/tap impulse, 1 on press then decays toward 0 */
  click: 0,
  clickPos: { x: 0, y: 0 },

  /** device-tilt (gyro) parallax input, -1 → 1 */
  tiltX: 0,
  tiltY: 0,

  /** adaptive quality from PerformanceMonitor: 1 = high, 0.5 = low */
  quality: 1,
};
