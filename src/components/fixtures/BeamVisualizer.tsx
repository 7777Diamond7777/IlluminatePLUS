import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createBeamLight } from '../../utils/3d/lightingUtils';
import { Fixture } from '../../types/fixtures';

interface BeamVisualizerProps {
  fixture: Fixture;
  scene: THREE.Scene;
}

const BeamVisualizer: React.FC<BeamVisualizerProps> = ({ fixture, scene }) => {
  const beamRef = useRef<THREE.SpotLight>();
  const beamHelperRef = useRef<THREE.SpotLightHelper>();

  useEffect(() => {
    // Create beam light
    const beam = createBeamLight(0xffffff, 1);
    beamRef.current = beam;

    // Create beam helper for visualization
    const beamHelper = new THREE.SpotLightHelper(beam);
    beamHelperRef.current = beamHelper;

    // Add to scene
    scene.add(beam);
    scene.add(beam.target);
    scene.add(beamHelper);

    // Update beam position based on fixture
    if (fixture.position) {
      beam.position.set(
        fixture.position.x,
        fixture.position.y,
        fixture.position.z
      );
    }

    return () => {
      scene.remove(beam);
      scene.remove(beam.target);
      scene.remove(beamHelper);
      beam.dispose();
    };
  }, [fixture, scene]);

  // Update beam properties based on fixture channels
  useEffect(() => {
    if (!beamRef.current || !beamHelperRef.current) return;

    const intensityChannel = fixture.channels.find(c => c.type === 'intensity');
    const colorChannel = fixture.channels.find(c => c.type === 'color');
    const zoomChannel = fixture.channels.find(c => c.type === 'zoom');

    if (intensityChannel) {
      beamRef.current.intensity = intensityChannel.defaultValue || 0;
    }

    if (colorChannel) {
      const color = new THREE.Color(colorChannel.defaultValue || 0xffffff);
      beamRef.current.color = color;
    }

    if (zoomChannel) {
      beamRef.current.angle = (zoomChannel.defaultValue || 30) * Math.PI / 180;
    }

    beamHelperRef.current.update();
  }, [fixture]);

  return null;
};

export default BeamVisualizer;