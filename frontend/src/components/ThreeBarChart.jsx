import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function ThreeBarChart({ data, xField, yField }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!data?.length || !xField || !yField) return;

    /* ---------- basic scene ---------- */
    const mount   = mountRef.current;
    const scene   = new THREE.Scene();
    const camera  = new THREE.PerspectiveCamera(45, mount.clientWidth / 400, 1, 1000);
    camera.position.set(0, 40, 80);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, 400);
    mount.appendChild(renderer.domElement);

    /* ---------- helpers & controls ---------- */
    new OrbitControls(camera, renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    scene.add(new THREE.GridHelper(100, 10));

    /* ---------- bars ---------- */
    const maxY = Math.max(...data.map(d => Number(d[yField]) || 0)) || 1;

    data.forEach((d, i) => {
      const h   = (Number(d[yField]) / maxY) * 30;
      const geo = new THREE.BoxGeometry(2, h, 2);
      const mat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
      const bar = new THREE.Mesh(geo, mat);
      bar.position.set(i * 3 - (data.length * 1.5), h / 2, 0);
      scene.add(bar);
    });

    /* ---------- animate ---------- */
    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    /* ---------- handle resize ---------- */
    const onResize = () => {
      camera.aspect = mount.clientWidth / 400;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, 400);
    };
    window.addEventListener('resize', onResize);

    /* ---------- cleanup ---------- */
    return () => {
      window.removeEventListener('resize', onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse(obj => {
        if (obj.isMesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, [data, xField, yField]);

  return <div ref={mountRef} className="w-full" />;
}
