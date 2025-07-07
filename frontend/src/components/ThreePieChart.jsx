import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export default function ThreePieChart({ data, yField, doughnut }) {
  const sectors = useMemo(() => {
    const total = data.reduce((sum, r) => sum + (Number(r[yField]) || 0), 0);
    let start = 0;
    return data.map((r, idx) => {
      const value = Number(r[yField]) || 0;
      const angle = (value / total) * Math.PI * 2;
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.absarc(0, 0, 10, start, start + angle, false);
      if (doughnut) {
        const hole = new THREE.Path();
        hole.absarc(0, 0, 5, 0, Math.PI * 2, true);
        shape.holes.push(hole);
      }
      start += angle;
      return { shape, color: COLORS[idx % COLORS.length] };
    });
  }, [data, yField, doughnut]);

  return (
    <Canvas camera={{ position: [0, 15, 25], fov: 50 }}>
      <ambientLight />
      <directionalLight position={[5, 10, 5]} />
      {sectors.map(({ shape, color }, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
          <extrudeGeometry args={[shape, { depth: 2, bevelEnabled: false }]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      <OrbitControls />
    </Canvas>
  );
}

const COLORS = [
  '#60A5FA', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6',
  '#3B82F6', '#F472B6', '#34D399', '#F87171', '#A78BFA',
];