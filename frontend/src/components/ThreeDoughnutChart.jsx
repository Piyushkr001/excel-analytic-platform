import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const degToRad = (deg) => (deg * Math.PI) / 180;

function DoughnutSlice({ startAngle, angle, color, innerRadius = 1.5, outerRadius = 3, height = 1 }) {
  const shape = new THREE.Shape();

  shape.absarc(0, 0, outerRadius, degToRad(startAngle), degToRad(startAngle + angle), false);

  const hole = new THREE.Path();
  hole.absarc(0, 0, innerRadius, degToRad(startAngle), degToRad(startAngle + angle), false);
  shape.holes.push(hole);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
  });

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function ThreeDoughnutChart({ data, field }) {
  if (!data || !data.length || !field) return null;

  const total = data.reduce((sum, row) => sum + Number(row[field] || 0), 0);

  let currentAngle = 0;
  const slices = data.map((row, i) => {
    const value = Number(row[field] || 0);
    const angle = (value / total) * 360;
    const color = `hsl(${(i * 51) % 360}, 70%, 55%)`;
    const slice = (
      <DoughnutSlice
        key={i}
        startAngle={currentAngle}
        angle={angle}
        color={color}
      />
    );
    currentAngle += angle;
    return slice;
  });

  return (
    <div className="w-full h-[400px] border rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 5, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <group>{slices}</group>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
