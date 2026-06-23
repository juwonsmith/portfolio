"use client";

import { useEffect } from "react";
import { scrollState } from "./scrollStore";

// Feeds device-orientation (gyro) into scrollState.tiltX/tiltY so the WebGL
// scene gets parallax on touch — the mobile equivalent of mouse parallax.
// iOS 13+ requires a user gesture to request permission; we hook the first touch.
export function useTilt() {
  useEffect(() => {
    if (scrollState.reducedMotion || !scrollState.coarsePointer) return;
    if (typeof window === "undefined") return;

    let attached = false;

    const onOrient = (e: DeviceOrientationEvent) => {
      // gamma: left/right tilt (-90..90), beta: front/back (-180..180)
      const gx = Math.max(-1, Math.min(1, (e.gamma ?? 0) / 35));
      const gy = Math.max(-1, Math.min(1, ((e.beta ?? 0) - 45) / 35));
      // low-pass filter for smoothness; invert Y so tilting forward looks "down"
      scrollState.tiltX = scrollState.tiltX * 0.9 + gx * 0.1;
      scrollState.tiltY = scrollState.tiltY * 0.9 + -gy * 0.1;
    };

    const attach = () => {
      if (attached) return;
      attached = true;
      window.addEventListener("deviceorientation", onOrient);
    };

    const DOE = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };

    let cleanupGesture: (() => void) | undefined;
    if (DOE && typeof DOE.requestPermission === "function") {
      const onGesture = () => {
        DOE.requestPermission?.()
          .then((res) => {
            if (res === "granted") attach();
          })
          .catch(() => {});
        cleanupGesture?.();
      };
      window.addEventListener("touchend", onGesture, { once: true });
      cleanupGesture = () => window.removeEventListener("touchend", onGesture);
    } else {
      attach();
    }

    return () => {
      window.removeEventListener("deviceorientation", onOrient);
      cleanupGesture?.();
    };
  }, []);
}
