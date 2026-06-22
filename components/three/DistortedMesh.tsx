"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "@/lib/shaders";
import { scrollState } from "@/lib/scrollStore";

export default function DistortedMesh() {
  const mesh = useRef<THREE.Mesh>(null!);
  const mat = useRef<THREE.ShaderMaterial>(null!);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uDistort: { value: 0.55 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color("#070a18") },
      uColorB: { value: new THREE.Color("#1d2a5e") },
      uColorC: { value: new THREE.Color("#8fb0ff") },
    }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = scrollState.progress;

    mat.current.uniforms.uTime.value = t;
    mat.current.uniforms.uScroll.value = THREE.MathUtils.lerp(
      mat.current.uniforms.uScroll.value,
      p,
      0.06
    );
    mat.current.uniforms.uMouse.value.lerp(state.pointer, 0.04);

    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.14;
      mesh.current.rotation.x = THREE.MathUtils.lerp(
        mesh.current.rotation.x,
        state.pointer.y * 0.3 + p * 1.6,
        0.05
      );
      // drift to the right as the page scrolls so copy gets breathing room
      mesh.current.position.x = THREE.MathUtils.lerp(
        mesh.current.position.x,
        p * 1.5,
        0.05
      );
      const s = 1 + Math.sin(t * 0.5) * 0.03 - p * 0.18;
      mesh.current.scale.setScalar(s);
    }
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.15, 48]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
