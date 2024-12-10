import * as THREE from 'three';
import { hsv2rgb } from '@thi.ng/color';
import { Channel } from '../../types/fixtures';

export function calculateBeamColor(channels: Channel[]): THREE.Color {
  const colorChannels = channels.filter(c => c.type === 'color');
  
  if (colorChannels.length === 3) {
    // RGB mode
    const [r, g, b] = colorChannels.map(c => (c.defaultValue || 0) / 255);
    return new THREE.Color(r, g, b);
  } else if (colorChannels.length === 1) {
    // Color wheel simulation
    const value = (colorChannels[0].defaultValue || 0) / 255;
    const [r, g, b] = hsv2rgb([value * 360, 1, 1]);
    return new THREE.Color(r, g, b);
  }
  
  return new THREE.Color(1, 1, 1);
}

export function createBeamGeometry(length: number, startRadius: number, endRadius: number): THREE.BufferGeometry {
  const geometry = new THREE.CylinderGeometry(endRadius, startRadius, length, 32, 1, true);
  geometry.translate(0, -length / 2, 0);
  geometry.rotateX(Math.PI / 2);
  return geometry;
}

export function createBeamMaterial(color: THREE.Color, intensity: number): THREE.Material {
  return new THREE.MeshPhongMaterial({
    color: color,
    transparent: true,
    opacity: intensity * 0.3,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
}

export function updateBeam(
  beam: THREE.Mesh,
  channels: Channel[],
  position: THREE.Vector3,
  rotation: THREE.Euler
): void {
  const intensityChannel = channels.find(c => c.type === 'intensity');
  const intensity = (intensityChannel?.defaultValue || 0) / 255;
  
  const zoomChannel = channels.find(c => c.type === 'zoom');
  const zoom = (zoomChannel?.defaultValue || 128) / 255;
  
  const color = calculateBeamColor(channels);
  
  // Update material
  const material = beam.material as THREE.MeshPhongMaterial;
  material.color = color;
  material.opacity = intensity * 0.3;
  
  // Update geometry based on zoom
  const length = 20;
  const startRadius = 0.1;
  const endRadius = startRadius + (zoom * 2);
  
  beam.geometry.dispose();
  beam.geometry = createBeamGeometry(length, startRadius, endRadius);
  
  // Update position and rotation
  beam.position.copy(position);
  beam.rotation.copy(rotation);
}