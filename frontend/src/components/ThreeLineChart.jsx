import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export default function ThreeLineChart({ data, xField, yField }) {
  const points = useMemo(
    () =>
      data.map((row) => [
        Number(row[xField]) || 0,
        Number(row[yField]) || 0,
        0,
      ]),
    [data, xField, yField]
  );

  return (
    <Canvas camera={{ position: [0, 30, 60], fov: 45 }}>
      <ambientLight />
      <directionalLight position={[5, 10, 5]} />
      <Line points={points} />
      <gridHelper args={[50, 50]} />
      <OrbitControls />
    </Canvas>
  );
}

function Line({ points }) {
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(
      points.map((p) => new THREE.Vector3(...p))
    );
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial attach="material" color="#3b82f6" linewidth={2} />
    </line>
  );
}
