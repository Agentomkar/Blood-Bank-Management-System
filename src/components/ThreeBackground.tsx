"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function seededRandom(seed: number) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

function BloodCell({
  position,
  speed,
  size,
  color,
}: {
  position: [number, number, number];
  speed: number;
  size: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPos = useRef(position);
  const timeOffset = useMemo(
    () =>
      seededRandom(
        position[0] * 13.17 + position[1] * 29.43 + position[2] * 7.91 + speed + size
      ) *
      Math.PI *
      2,
    [position, speed, size]
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed + timeOffset;
    meshRef.current.position.x = initialPos.current[0] + Math.sin(t * 0.5) * 0.3;
    meshRef.current.position.y = initialPos.current[1] + Math.sin(t * 0.7) * 0.2 + Math.cos(t * 0.3) * 0.1;
    meshRef.current.position.z = initialPos.current[2] + Math.cos(t * 0.4) * 0.2;
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.5;
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.z = Math.cos(t * 0.4) * 0.3;
  });

  // Create a disc/biconcave shape like a real blood cell
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const radius = size;
    shape.absellipse(0, 0, radius, radius * 0.4, 0, Math.PI * 2, false, 0);
    const extrudeSettings = {
      depth: size * 0.08,
      bevelEnabled: true,
      bevelThickness: size * 0.03,
      bevelSize: size * 0.02,
      bevelSegments: 4,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [size]);

  return (
    <mesh ref={meshRef} position={position} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.35}
        roughness={0.3}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function PlasmaParticles({ count = 60 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seededRandom(i * 4 + 1) - 0.5) * 20;
      pos[i * 3 + 1] = (seededRandom(i * 4 + 2) - 0.5) * 20;
      pos[i * 3 + 2] = (seededRandom(i * 4 + 3) - 0.5) * 10;
      sz[i] = seededRandom(i * 4 + 4) * 3 + 1;
    }
    return { positions: pos, sizes: sz };
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.02;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#DC143C"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CellField() {
  const cells = useMemo(() => {
    const items: {
      position: [number, number, number];
      speed: number;
      size: number;
      color: string;
    }[] = [];
    const colors = ["#8B0000", "#DC143C", "#FF6B6B", "#CC1F1F", "#A81414"];
    for (let i = 0; i < 25; i++) {
      items.push({
        position: [
          (seededRandom(i * 6 + 1) - 0.5) * 16,
          (seededRandom(i * 6 + 2) - 0.5) * 12,
          (seededRandom(i * 6 + 3) - 0.5) * 8 - 2,
        ],
        speed: 0.3 + seededRandom(i * 6 + 4) * 0.7,
        size: 0.15 + seededRandom(i * 6 + 5) * 0.35,
        color: colors[Math.floor(seededRandom(i * 6 + 6) * colors.length)],
      });
    }
    return items;
  }, []);

  return (
    <>
      {cells.map((cell, i) => (
        <BloodCell key={i} {...cell} />
      ))}
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.28 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
        <pointLight position={[-5, -5, 5]} intensity={0.4} color="#DC143C" />
        <pointLight position={[5, -3, 3]} intensity={0.2} color="#8B0000" />
        <fog attach="fog" args={["#0a0a0a", 5, 18]} />
        <CellField />
        <PlasmaParticles count={80} />
      </Canvas>
    </div>
  );
}
