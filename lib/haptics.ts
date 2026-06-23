// Tiny haptic tap for touch devices. No-ops silently where unsupported (iOS Safari).
export function tap(ms = 10): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(ms);
    } catch {
      /* ignore */
    }
  }
}
