import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function ThreeBubbleChart({ data, xField, yField, bubble }) {
  return (
    <Canvas camera={{ position: [0, 30, 60], fov: 45 }}>
      <ambientLight />
      <directionalLight position={[5, 10, 5]} />
      {data.map((row, i) => {
        const x = Number(row[xField]) || 0;
        const y = Number(row[yField]) || 0;
        const r = bubble ? Number(row.radius) || 5 : 2;
        return (
          <mesh key={i} position={[x, y, 0]}>
            <sphereGeometry args={[r, 16, 16]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
        );
      })}
      <gridHelper args={[50, 50]} />
      <OrbitControls />
    </Canvas>
  );
}
