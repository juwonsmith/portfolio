// A tiny module-level store so the smooth-scroll layer (Lenis, on the DOM)
// and the WebGL scene (R3F useFrame loop) can share scroll state without
// triggering React re-renders.

export const scrollState = {
  /** 0 → 1 across the whole page */
  progress: 0,
  /** scroll velocity from Lenis */
  velocity: 0,
};
