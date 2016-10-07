import * as THREE from 'three';

import Config from '../../data/config';

export default class Camera {
  constructor(renderer) {
    const width = renderer.domElement.width;
    const height = renderer.domElement.height;

    this.threeCamera = new THREE.PerspectiveCamera(Config.camera.fov, width / height, Config.camera.near, Config.camera.far);
    this.threeCamera.position.set(Config.camera.posX, Config.camera.posY, Config.camera.posZ);

    this.updateSize(renderer);
    
    // Listeners
    window.addEventListener('resize', () => this.updateSize(renderer), false);
  }

  updateSize(renderer) {
    // Multiply by dpr in case it is retina device
    this.threeCamera.aspect = renderer.domElement.width * Config.dpr / renderer.domElement.height * Config.dpr;
    this.threeCamera.updateProjectionMatrix();
  }
}
