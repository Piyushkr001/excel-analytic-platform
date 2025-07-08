import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const deg2rad = (deg) => (deg * Math.PI) / 180;

function Slice({ start, sweep, color, rIn = 1.5, rOut = 3, height = 1 }) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, rOut, deg2rad(start), deg2rad(start + sweep), false);

  const hole = new THREE.Path();
  hole.absarc(0, 0, rIn, deg2rad(start), deg2rad(start + sweep), false);
  shape.holes.push(hole);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
  });

  return (
    <mesh geometry={geom} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function ThreeDoughnutChart({ data, yField }) {
  if (!data?.length || !yField) return null;

  const total = data.reduce((s, row) => s + Number(row[yField] || 0), 0);
  let cur = 0;
  const slices = data.map((row, i) => {
    const value = Number(row[yField] || 0);
    const sweep = (value / total) * 360;
    const color = `hsl(${(i * 47) % 360}, 70%, 55%)`;
    const slice = <Slice key={i} start={cur} sweep={sweep} color={color} />;
    cur += sweep;
    return slice;
  });

  return (
    <div className="w-full h-[400px] border rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 5, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <group>{slices}</group>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
