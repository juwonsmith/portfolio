"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Environment,
  Lightformer,
  PerformanceMonitor,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import GlassBlob from "@/components/three/GlassBlob";
import DistortedMesh from "@/components/three/DistortedMesh";
import Particles from "@/components/three/Particles";
import { scrollState } from "@/lib/scrollStore";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Integrates the shared "energy" from scroll velocity + pointer speed + taps,
// then modulates the post-processing live. All cheap scalar/Vector2 writes.
function EnergyBus({
  bloom,
  chroma,
  vignette,
}: {
  bloom: React.MutableRefObject<any>;
  chroma: React.MutableRefObject<any>;
  vignette: React.MutableRefObject<any>;
}) {
  const last = useRef(new THREE.Vector2());
  const frame = useRef(0);

  useFrame((_state, delta) => {
    const motion = scrollState.reducedMotion ? 0 : 1;
    const px = scrollState.pointer.x;
    const py = scrollState.pointer.y;
    const dx = px - last.current.x;
    const dy = py - last.current.y;
    const pSpeed = Math.sqrt(dx * dx + dy * dy) / Math.max(delta, 0.001);
    last.current.set(px, py);
    scrollState.pointerSpeed = pSpeed;

    const targetEnergy =
      Math.min(
        1,
        Math.abs(scrollState.velocity) * 0.12 +
          Math.min(pSpeed * 0.08, 0.5) +
          scrollState.click
      ) * motion;
    const e = scrollState.energy;
    // fast attack, slow decay
    scrollState.energy = e + (targetEnergy - e) * (e < targetEnergy ? 0.18 : 0.05);
    scrollState.click *= 0.92;
    if (scrollState.click < 0.001) scrollState.click = 0;

    const en = scrollState.energy;
    if (bloom.current) bloom.current.intensity = 1.1 + en * 0.9 * motion;
    if (chroma.current?.offset?.set) {
      chroma.current.offset.set(
        0.0008 + en * 0.0022 * motion,
        0.0008 + py * 0.0008 * motion
      );
    }
    if (vignette.current) vignette.current.darkness = 0.85 - en * 0.12 * motion;

    frame.current++;
    if (frame.current % 2 === 0 && typeof document !== "undefined") {
      document.documentElement.style.setProperty("--energy", en.toFixed(3));
    }
  });

  return null;
}

// Camera parallax + push-in. Uses gyro tilt on touch, mouse on desktop.
function Rig() {
  useFrame((state) => {
    const motion = scrollState.reducedMotion ? 0 : 1;
    const p = scrollState.progress;
    const coarse = scrollState.coarsePointer;
    const px = (coarse ? scrollState.tiltX : scrollState.pointer.x) * motion;
    const py = (coarse ? scrollState.tiltY : scrollState.pointer.y) * motion;
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      4.4 - p * 1.1,
      0.05
    );
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      px * 0.3,
      0.04
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      py * 0.3,
      0.04
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene() {
  // touch / very-high-DPR devices get the cheap shader blob + lower dpr
  const coarse = useMemo(
    () =>
      typeof window !== "undefined" &&
      (scrollState.coarsePointer || window.devicePixelRatio > 2.5),
    []
  );
  const [dpr, setDpr] = useState(coarse ? 1 : 1.25);
  const bloom = useRef<any>(null);
  const chroma = useRef<any>(null);
  const vignette = useRef<any>(null);
  const caOffset = useMemo(() => new THREE.Vector2(0.0008, 0.0008), []);

  // global pointer (canvas is pointer-events-none so R3F can't see it) + tap impulse
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      scrollState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onDown = (e: PointerEvent) => {
      if (scrollState.reducedMotion) return;
      scrollState.click = 1;
      scrollState.clickPos.x = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.clickPos.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 h-screen w-full">
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={dpr}
      >
        <PerformanceMonitor
          onDecline={() => {
            setDpr(1);
            scrollState.quality = 0.5;
          }}
          onIncline={() => {
            setDpr(coarse ? 1 : 1.25);
            scrollState.quality = 1;
          }}
          flipflops={3}
        />
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 4, 5]} intensity={1.2} />

          <Particles />
          {coarse ? <DistortedMesh /> : <GlassBlob />}

          <Environment resolution={256}>
            <Lightformer form="circle" intensity={2.4} position={[0, 2, 4]} scale={6} color="#9db4ff" />
            <Lightformer form="circle" intensity={2} position={[-4, -1, 3]} scale={5} color="#f472b6" />
            <Lightformer form="circle" intensity={1.6} position={[4, 1, -2]} scale={5} color="#ffffff" />
            <Lightformer form="ring" intensity={1.4} position={[0, -3, 2]} scale={4} color="#7aa2ff" />
          </Environment>

          <Rig />
          <EnergyBus bloom={bloom} chroma={chroma} vignette={vignette} />

          <EffectComposer>
            <Bloom
              ref={bloom}
              mipmapBlur
              luminanceThreshold={0.22}
              luminanceSmoothing={0.5}
              intensity={1.1}
            />
            <ChromaticAberration
              ref={chroma}
              blendFunction={BlendFunction.NORMAL}
              offset={caOffset}
              radialModulation={false}
              modulationOffset={0}
            />
            <Noise opacity={0.035} blendFunction={BlendFunction.OVERLAY} />
            <Vignette ref={vignette} offset={0.25} darkness={0.85} eskil={false} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,6,12,0.8)_100%)]" />
    </div>
  );
}
