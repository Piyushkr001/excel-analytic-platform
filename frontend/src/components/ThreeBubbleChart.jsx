import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';

function Bubble({ x, y, z, r = 1, color = 'orange' }) {
  return (
    <mesh position={[x, y, z]}>
      <sphereGeometry args={[r, 32, 32]} />
      <meshStandardMaterial color={color} transparent opacity={0.75} />
    </mesh>
  );
}

export default function ThreeBubbleChart({ data, xField, yField, rField }) {
  if (!data || !xField || !yField || !rField) return null;

  const bubbles = data.map((row, i) => {
    const x = Number(row[xField]) || 0;
    const y = Number(row[yField]) || 0;
    const z = i * 0.5; // spread in Z to make it 3D
    const rawR = Number(row[rField]) || 1;
    const r = Math.max(0.3, Math.sqrt(rawR) * 0.2); // scale radius
    const color = `hsl(${(i * 61) % 360}, 70%, 55%)`;

    return <Bubble key={i} x={x} y={y} z={z} r={r} color={color} />;
  });

  return (
    <div className="w-full h-[400px] border rounded-xl overflow-hidden">
      <Canvas camera={{ position: [6, 6, 6], fov: 55 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} />
        <Grid args={[10, 10]} />
        {bubbles}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
