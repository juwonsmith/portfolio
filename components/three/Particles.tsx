"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollStore";

export default function Particles() {
  const points = useRef<THREE.Points>(null!);

  // fewer particles on touch / low-power devices
  const count = useMemo(() => (scrollState.coarsePointer ? 900 : 1800), []);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    const pts = points.current;
    if (!pts) return;
    pts.rotation.x = scrollState.progress * 0.5;
    if (scrollState.reducedMotion) return;
    pts.rotation.y += delta * 0.02;
    pts.position.z = scrollState.progress * 2.5;
    // scroll momentum + energy gently scatters the field, then settles
    const boost = Math.min(
      Math.abs(scrollState.velocity) * 0.02 + scrollState.energy * 0.08,
      0.18
    );
    pts.scale.setScalar(1 + boost);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#9bb4ff"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
