import THREE from 'three';

import Config from './../data/config';

export default class Renderer {
  constructor(container, scene) {
    this.container = container;
    this.scene = scene;

    this.threeRenderer = new THREE.WebGLRenderer({antialias: true});

    //this.renderer.setClearColor(0x000000, 0);
    this.threeRenderer.setClearColor(scene.fog.color);
    this.threeRenderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(this.threeRenderer.domElement);

    this.threeRenderer.gammaInput = true;
    this.threeRenderer.gammaOutput = true;

    // shadow
    this.threeRenderer.shadowMap.enabled = true;
    this.threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.threeRenderer.shadowMapSoft = true;

    this.threeRenderer.autoClear = false;

    Config.maxAnisotropy = this.threeRenderer.getMaxAnisotropy();

    this.updateSize();

    // Listeners
    document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
    window.addEventListener('resize', () => this.updateSize(), false);
  }

  updateSize() {
    this.threeRenderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
  }

  render(scene, camera) {
    this.threeRenderer.render(scene, camera);
  }
}
