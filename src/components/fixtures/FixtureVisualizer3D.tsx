import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useFixtureStore } from '../../store/fixtureStore';
import { createStage, createFixture, updateFixtureColor } from '../../utils/3d/sceneUtils';
import { initializeLights } from '../../utils/3d/lightingUtils';
import BeamVisualizer from './BeamVisualizer';

const FixtureVisualizer3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const controlsRef = useRef<OrbitControls>();
  const fixtureModelsRef = useRef<Map<string, THREE.Object3D>>(new Map());

  const { fixtures, activeGroup, groups } = useFixtureStore();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Add stage and basic lighting
    const stage = createStage();
    scene.add(stage);
    initializeLights(scene);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Update fixtures when they change
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove old fixtures
    fixtureModelsRef.current.forEach((model) => {
      sceneRef.current?.remove(model);
    });
    fixtureModelsRef.current.clear();

    // Add new fixtures
    fixtures.forEach((fixture) => {
      const model = createFixture(fixture);
      if (model) {
        sceneRef.current?.add(model);
        fixtureModelsRef.current.set(fixture.id, model);

        // Update color based on group
        if (activeGroup) {
          const group = groups.find(g => g.id === activeGroup);
          const isInGroup = group?.fixtures.includes(fixture.id);
          updateFixtureColor(model, isInGroup ? 0x4a90e2 : 0x666666);
        }
      }
    });
  }, [fixtures, activeGroup, groups]);

  return (
    <div className="space-y-4">
      <div 
        ref={containerRef} 
        className="w-full h-[600px] rounded-lg overflow-hidden"
        style={{ touchAction: 'none' }}
      />
      {sceneRef.current && fixtures.map(fixture => (
        <BeamVisualizer
          key={fixture.id}
          fixture={fixture}
          scene={sceneRef.current}
        />
      ))}
    </div>
  );
};

export default FixtureVisualizer3D;