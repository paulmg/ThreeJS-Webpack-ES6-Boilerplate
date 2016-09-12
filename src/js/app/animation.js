import THREE from 'three';

export default class Animation {
  constructor(obj, clip) {
    this.obj = obj;

    this.mixer = new THREE.AnimationMixer(this.obj);

    this.playClip(clip);
  }

  playClip(clip) {
    this.action = this.mixer.clipAction(clip);

    this.action.play();
  }

  update(delta) {
    if(this.mixer) {
      this.mixer.update(delta);
    }
  }
}
