import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useDMXStore } from '../store/dmxStore';

const FixtureVisualizer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { universes } = useDMXStore();

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Add stage platform
    const stagePlatform = new THREE.Mesh(
      new THREE.BoxGeometry(20, 0.5, 10),
      new THREE.MeshPhongMaterial({ color: 0x333333 })
    );
    scene.add(stagePlatform);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add DMX fixtures
    const fixtures: THREE.Mesh[] = [];
    universes.forEach(universe => {
      universe.channels.forEach((channel, index) => {
        if (index % 16 === 0) { // Create a fixture for each 16 channels
          const fixture = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 0.5),
            new THREE.MeshPhongMaterial({ color: 0x666666 })
          );
          fixture.position.set(
            (index / 16) - 5,
            2,
            universe.id - 2
          );
          scene.add(fixture);
          fixtures.push(fixture);
        }
      });
    });

    camera.position.z = 15;
    camera.position.y = 5;
    camera.lookAt(0, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update fixture colors based on DMX values
      fixtures.forEach((fixture, index) => {
        const universe = universes[Math.floor(index / 32)];
        if (universe) {
          const startChannel = (index % 32) * 16;
          const intensity = universe.channels[startChannel]?.value || 0;
          const material = fixture.material as THREE.MeshPhongMaterial;
          material.emissive.setHSL(0, 0, intensity / 512);
        }
      });
      
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [universes]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div
        ref={containerRef}
        className="w-full h-64 rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default FixtureVisualizer;