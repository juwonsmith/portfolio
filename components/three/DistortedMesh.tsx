"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "@/lib/shaders";
import { scrollState } from "@/lib/scrollStore";

// The lightweight hero blob (custom fresnel shader, GPU vertex displacement).
// Used on touch / low-DPR devices instead of the costly transmission glass.
// Reads the same shared reactivity (scroll, energy, tap, tilt) as everything else.
export default function DistortedMesh() {
  const mesh = useRef<THREE.Mesh>(null!);
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const tmp = useMemo(() => new THREE.Vector2(), []);
  const colorCool = useMemo(() => new THREE.Color("#8fb0ff"), []);
  const colorWarm = useMemo(() => new THREE.Color("#ff8fc8"), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uDistort: { value: 0.55 },
      uEnergy: { value: 0 },
      uClick: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color("#070a18") },
      uColorB: { value: new THREE.Color("#1d2a5e") },
      uColorC: { value: new THREE.Color("#8fb0ff") },
    }),
    []
  );

  useFrame((state, delta) => {
    const m = mat.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const p = scrollState.progress;
    const motion = scrollState.reducedMotion ? 0 : 1;
    const u = m.uniforms;

    u.uTime.value = motion ? t : 0;
    u.uScroll.value = THREE.MathUtils.lerp(u.uScroll.value, p, 0.06);
    u.uEnergy.value = THREE.MathUtils.lerp(
      u.uEnergy.value,
      scrollState.energy * motion,
      0.1
    );
    u.uClick.value = scrollState.click * motion;

    // tilt drives parallax on touch; mouse on desktop
    const mx = (scrollState.coarsePointer ? scrollState.tiltX : scrollState.pointer.x) * motion;
    const my = (scrollState.coarsePointer ? scrollState.tiltY : scrollState.pointer.y) * motion;
    tmp.set(mx, my);
    (u.uMouse.value as THREE.Vector2).lerp(tmp, 0.05);

    // scroll-coupled mood: cool blue → warm pink down the page
    (u.uColorC.value as THREE.Color).copy(colorCool).lerp(colorWarm, p);

    if (mesh.current) {
      if (motion) mesh.current.rotation.y += delta * 0.12;
      mesh.current.rotation.x = THREE.MathUtils.lerp(
        mesh.current.rotation.x,
        my * 0.3 + p * 1.2,
        0.05
      );
      mesh.current.position.x = THREE.MathUtils.lerp(
        mesh.current.position.x,
        p * 1.5,
        0.05
      );
      const s =
        (motion ? 1 + Math.sin(t * 0.5) * 0.03 : 1) -
        p * 0.18 +
        scrollState.click * 0.06 * motion;
      mesh.current.scale.setScalar(s);
    }
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.15, 24]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
