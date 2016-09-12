import THREE from 'three';

import Config from '../data/config';

export default class Geometry {
  constructor(scene) {
    this.scene = scene;
    this.geo = null;
  }

  make(type) {
    if(type == 'plane') {
      return (width, height, widthSegments = 1, heightSegments = 1) => {
        this.geo = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
      }
    }
  }

  place(position, rotation) {
    const material = new THREE.MeshStandardMaterial({ color: 0xCCCCCC, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(this.geo, material);

    mesh.position.set(...position);
    mesh.rotation.set(...rotation);

    if(Config.shadow.enabled) {
      mesh.receiveShadow = true;
      mesh.castShadow = true;
    }

    this.scene.add(mesh);
  }
}
