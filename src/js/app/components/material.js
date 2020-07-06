import * as THREE from 'three';

// USe this class as a helper to set up some default materials
export default class Material {
  constructor(color) {
    this.basic = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide
    });

    this.standard = new THREE.MeshStandardMaterial({
      color,
      shading: THREE.FlatShading,
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide
    });

    this.wire = new THREE.MeshBasicMaterial({wireframe: true});
  }
}

