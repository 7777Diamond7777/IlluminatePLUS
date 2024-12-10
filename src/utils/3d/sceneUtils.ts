import * as THREE from 'three';
import { Fixture } from '../../types/fixtures';

export function createStage(): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(20, 0.2, 10);
  const material = new THREE.MeshPhongMaterial({ 
    color: 0x333333,
    roughness: 0.8,
    metalness: 0.2
  });
  const stage = new THREE.Mesh(geometry, material);
  stage.receiveShadow = true;
  stage.position.y = -0.1;
  return stage;
}

export function createFixture(fixture: Fixture): THREE.Object3D {
  const group = new THREE.Group();

  // Base
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.3, 8),
    new THREE.MeshPhongMaterial({ color: 0x666666 })
  );
  base.castShadow = true;
  group.add(base);

  // Head
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.2, 0.4),
    new THREE.MeshPhongMaterial({ color: 0x444444 })
  );
  head.position.y = 0.25;
  head.castShadow = true;
  group.add(head);

  // Lens
  const lens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.15, 0.1, 16),
    new THREE.MeshPhongMaterial({ 
      color: 0x88ccff,
      transparent: true,
      opacity: 0.5
    })
  );
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0, 0.25, 0.2);
  group.add(lens);

  // Position the fixture
  if (fixture.position) {
    group.position.set(
      fixture.position.x,
      fixture.position.y,
      fixture.position.z
    );
  }

  if (fixture.rotation) {
    group.rotation.set(
      fixture.rotation.x,
      fixture.rotation.y,
      fixture.rotation.z
    );
  }

  return group;
}

export function updateFixtureColor(model: THREE.Object3D, color: number): void {
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const material = child.material as THREE.MeshPhongMaterial;
      if (!material.transparent) {
        material.color.setHex(color);
      }
    }
  });
}