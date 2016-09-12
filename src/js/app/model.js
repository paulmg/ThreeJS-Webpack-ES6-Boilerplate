import THREE from 'three';

import Material from './material';
import Helper from './helper';
import Config from './../data/config';

export default class Model {
  constructor(scene, manager, textures) {
    this.scene = scene;
    this.textures = textures;

    this.loader = new THREE.ObjectLoader(manager);
    this.obj = null;
  }

  load() {
    // load a resource
    this.loader.load(Config.model.path, (obj) => {
      obj.traverse((child) => {
        if(child instanceof THREE.Mesh) {
          let material = new Material().standard;
          material.map = this.textures.UV;
          child.material = material;

          if(Config.shadow.enabled) {
            child.receiveShadow = true;
            child.castShadow = true;
          }
        }
      });

      if(Config.isDev && Config.mesh.enableHelper) {
        new Helper(this.scene, obj);
      }

      // set prop to obj
      this.obj = obj;

      obj.scale.multiplyScalar(Config.model.scale);

      // add object to scene
      this.scene.add(obj);
    }, Model.onProgress, Model.onError);
  }

  static onProgress(xhr) {
    if(xhr.lengthComputable) {
      let percentComplete = xhr.loaded / xhr.total * 100;

      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };

  static onError(xhr) {
    console.error(xhr);
  };
}
