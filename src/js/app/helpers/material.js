import * as THREE from 'three';

import Config from '../../data/config';

export default class Material {
  constructor() {
    this.emissive = new THREE.MeshBasicMaterial({
      color: 0xeeeeee,
      side: THREE.DoubleSide,
      fog: false
    });

    this.standard = new THREE.MeshStandardMaterial({
      shading: THREE.FlatShading,
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide,
      fog: false
    });

    this.wire = new THREE.MeshBasicMaterial({wireframe: true});
  }
}

