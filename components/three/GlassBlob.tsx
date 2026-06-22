"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { SimplexNoise } from "three-stdlib";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollStore";

const RADIUS = 1.1;
const DETAIL = 9;

export default function GlassBlob() {
  const mesh = useRef<THREE.Mesh>(null!);
  const noise = useMemo(() => new SimplexNoise(), []);

  // precompute the unit direction of every vertex so we can re-displace
  // it along its own normal every frame (organic, morphing silhouette)
  const { geometry, dirs } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(RADIUS, DETAIL);
    const pos = geo.attributes.position;
    const dirs: THREE.Vector3[] = [];
    for (let i = 0; i < pos.count; i++) {
      dirs.push(
        new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize()
      );
    }
    return { geometry: geo, dirs };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = scrollState.progress;
    const pos = geometry.attributes.position;

    const freq = 1.15 + p * 0.6;
    const amp = 0.22 + p * 0.12 + Math.min(Math.abs(scrollState.velocity) * 0.04, 0.15);

    for (let i = 0; i < dirs.length; i++) {
      const d = dirs[i];
      const n = noise.noise3d(d.x * freq + t * 0.25, d.y * freq, d.z * freq - t * 0.2);
      const r = RADIUS + n * amp;
      pos.setXYZ(i, d.x * r, d.y * r, d.z * r);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.12;
      mesh.current.rotation.x = THREE.MathUtils.lerp(
        mesh.current.rotation.x,
        state.pointer.y * 0.4 + p * 1.4,
        0.05
      );
      mesh.current.rotation.z = THREE.MathUtils.lerp(
        mesh.current.rotation.z,
        state.pointer.x * 0.25,
        0.05
      );
      mesh.current.position.x = THREE.MathUtils.lerp(
        mesh.current.position.x,
        p * 1.6,
        0.05
      );
      const s = 1 + Math.sin(t * 0.6) * 0.03 - p * 0.12;
      mesh.current.scale.setScalar(s);
    }
  });

  return (
    <mesh ref={mesh} geometry={geometry}>
      <MeshTransmissionMaterial
        samples={4}
        resolution={256}
        transmission={1}
        thickness={1.1}
        roughness={0.18}
        ior={1.35}
        chromaticAberration={0.3}
        anisotropy={0.2}
        distortion={0.2}
        distortionScale={0.3}
        temporalDistortion={0.1}
        color="#eaf0ff"
        attenuationColor="#a9bdff"
        attenuationDistance={2.2}
        background={new THREE.Color("#05060c")}
      />
    </mesh>
  );
}
