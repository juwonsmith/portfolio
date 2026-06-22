"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useState } from "react";
import {
  Environment,
  Lightformer,
  PerformanceMonitor,
  AdaptiveDpr,
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
import Particles from "@/components/three/Particles";
import { scrollState } from "@/lib/scrollStore";

function Rig() {
  useFrame((state) => {
    const p = scrollState.progress;
    // gentle push-in + mouse parallax on the camera
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      4.4 - p * 1.1,
      0.05
    );
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 0.3,
      0.04
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 0.3,
      0.04
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene() {
  const caOffset = useMemo(() => new THREE.Vector2(0.0008, 0.0008), []);
  const [dpr, setDpr] = useState(1.25);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 h-screen w-full">
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={dpr}
      >
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(1.25)}
          flipflops={3}
        />
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 4, 5]} intensity={1.2} />

          <Particles />
          <GlassBlob />

          {/* procedural environment — soft colored reflections in the glass, no network */}
          <Environment resolution={256}>
            <Lightformer
              form="circle"
              intensity={2.4}
              position={[0, 2, 4]}
              scale={6}
              color="#9db4ff"
            />
            <Lightformer
              form="circle"
              intensity={2}
              position={[-4, -1, 3]}
              scale={5}
              color="#f472b6"
            />
            <Lightformer
              form="circle"
              intensity={1.6}
              position={[4, 1, -2]}
              scale={5}
              color="#ffffff"
            />
            <Lightformer
              form="ring"
              intensity={1.4}
              position={[0, -3, 2]}
              scale={4}
              color="#7aa2ff"
            />
          </Environment>

          <Rig />

          <EffectComposer disableNormalPass>
            <Bloom
              mipmapBlur
              luminanceThreshold={0.15}
              luminanceSmoothing={0.5}
              intensity={1.1}
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={caOffset}
              radialModulation={false}
              modulationOffset={0}
            />
            <Noise opacity={0.035} blendFunction={BlendFunction.OVERLAY} />
            <Vignette offset={0.25} darkness={0.85} eskil={false} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,6,12,0.8)_100%)]" />
    </div>
  );
}
