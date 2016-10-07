import * as THREE from 'three';
import { Promise } from 'es6-promise';

import Config from '../../data/config';

export default class Texture {
  constructor() {
    this.textures = {};
  }

  load() {
    const loader = new THREE.TextureLoader();
    const maxAnisotropy = Config.maxAnisotropy;
    const imageFiles = Config.texture.imageFiles;

    const promiseArray = [];

    loader.setPath(Config.texture.path);

    imageFiles.forEach((imageFile) => {
      promiseArray.push(new Promise((resolve, reject) => {
        loader.load(imageFile.image,

          function(texture) {
            texture.anisotropy = maxAnisotropy;

            var modelOBJ = {};
            modelOBJ[imageFile.name] = texture;
            if(modelOBJ[imageFile.name] instanceof THREE.Texture)
              resolve(modelOBJ);
          },
          function(xhr) {
            console.log(xhr.loaded / xhr.total * 100 + '% loaded');
          },
          function(xhr) {
            reject(new Error(xhr + 'An error occurred loading while loading ' + imageFile.image));
          }
        )
      }));
    });

    return Promise.all(promiseArray).then((textures) => {
      for(var i = 0; i < textures.length; i++) {
        this.textures[Object.keys(textures[i])[0]] = textures[i][Object.keys(textures[i])[0]];
      }
    });
  }
}
