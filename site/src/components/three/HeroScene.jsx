import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

function Node({ position, label, color, scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.15;
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.15 * scale, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      <Text
        position={[0, -0.3 * scale, 0]}
        fontSize={0.1}
        color="#9898b0"
        anchorX="center"
        anchorY="top"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.woff2"
      >
        {label}
      </Text>
    </group>
  );
}

function Edge({ start, end }) {
  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ], [start, end]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#8b5cf6" transparent opacity={0.15} />
    </line>
  );
}

function Scene({ projects }) {
  const groupRef = useRef();

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  const nodes = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    const angleStep = (Math.PI * 2) / projects.length;
    const radius = 2.5;
    return projects.map((p, i) => ({
      position: [
        Math.cos(angleStep * i) * radius,
        (Math.random() - 0.5) * 1.5,
        Math.sin(angleStep * i) * radius
      ],
      label: p.title?.split(' ')[0] || p.slug,
      color: p.status === 'active' ? '#06d6f0' : '#fbbf24',
      slug: p.slug
    }));
  }, [projects]);

  const edges = useMemo(() => {
    const edgeList = [];
    for (let i = 0; i < nodes.length; i++) {
      const next = (i + 1) % nodes.length;
      edgeList.push({ start: nodes[i].position, end: nodes[next].position });
      // Some cross connections for visual interest
      if (i % 3 === 0 && nodes.length > 3) {
        const cross = (i + 3) % nodes.length;
        edgeList.push({ start: nodes[i].position, end: nodes[cross].position });
      }
    }
    return edgeList;
  }, [nodes]);

  return (
    <group ref={groupRef}>
      {edges.map((e, i) => (
        <Edge key={`edge-${i}`} start={e.start} end={e.end} />
      ))}
      {nodes.map((n, i) => (
        <Node key={n.slug} {...n} />
      ))}
      {/* Central glow */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.8}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

export default function HeroScene({ projects = [] }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas
        camera={{ position: [0, 1, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#06d6f0" />
        <pointLight position={[-5, -3, 3]} intensity={0.5} color="#d946ef" />
        <Scene projects={projects} />
      </Canvas>
    </div>
  );
}
