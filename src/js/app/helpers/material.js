import * as THREE from 'three';

import Config from '../../data/config';

// USe this class as a Helper to set up some default materials
export default class Material {
  constructor() {
    this.emissive = new THREE.MeshBasicMaterial({
      color: 0xeeeeee,
      side: THREE.DoubleSide
    });

    this.standard = new THREE.MeshStandardMaterial({
      shading: THREE.FlatShading,
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide
    });

    this.phong = new THREE.MeshPhongMaterial({

    });

    this.wire = new THREE.MeshBasicMaterial({wireframe: true});
  }
}

