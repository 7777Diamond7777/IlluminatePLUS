import * as THREE from 'three';

export function initializeLights(scene: THREE.Scene): void {
  // Ambient light
  const ambient = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambient);

  // Main directional light
  const mainLight = new THREE.DirectionalLight(0xffffff, 1);
  mainLight.position.set(5, 10, 5);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 50;
  mainLight.shadow.camera.left = -10;
  mainLight.shadow.camera.right = 10;
  mainLight.shadow.camera.top = 10;
  mainLight.shadow.camera.bottom = -10;
  scene.add(mainLight);

  // Fill light
  const fillLight = new THREE.DirectionalLight(0x404040, 0.3);
  fillLight.position.set(-5, 5, -5);
  scene.add(fillLight);

  // Back light
  const backLight = new THREE.DirectionalLight(0x404040, 0.2);
  backLight.position.set(0, 5, -10);
  scene.add(backLight);
}

export function createBeamLight(color: number, intensity: number): THREE.SpotLight {
  const light = new THREE.SpotLight(color, intensity);
  light.angle = Math.PI / 6;
  light.penumbra = 0.3;
  light.decay = 2;
  light.distance = 50;
  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  return light;
}