import * as THREE from 'three';

export default class Animation {
  constructor(obj, clip) {
    // Object with animations
    this.obj = obj;

    // Initialize animation mixer
    this.mixer = new THREE.AnimationMixer(this.obj);

    // Simple animation player
    this.playClip(clip);
  }

  playClip(clip) {
    this.action = this.mixer.clipAction(clip);

    this.action.play();
  }

  // Call update in loop
  update(delta) {
    if(this.mixer) {
      this.mixer.update(delta);
    }
  }
}
