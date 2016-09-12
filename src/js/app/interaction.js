import THREE from 'three';

import Keyboard from './../utils/keyboard';
import Helpers from './../utils/helpers';
import Config from './../data/config';

export default class Interaction {
  constructor(renderer, scene, camera, controls) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;

    this.keyboard = new Keyboard();

    // listeners
    // mouse events
    this.renderer.domElement.addEventListener('mouseup', (event) => this.onMouseUp(event), false);
    this.renderer.domElement.addEventListener('mousemove', (event) => Helpers.throttle(this.onMouseMove(event), 250), false);
    this.renderer.domElement.addEventListener('mouseenter', (event) => this.onMouseEnter(event), false);
    this.renderer.domElement.addEventListener('mouseleave', (event) => this.onMouseLeave(event), false);
    this.renderer.domElement.addEventListener('mouseover', (event) => this.onMouseOver(event), false);

    // keyboard events
    this.keyboard.domElement.addEventListener('keydown', (event) => {
      if(event.repeat) {
        return;
      }
      if(this.keyboard.eventMatches(event, 'escape')) {
        console.log('Escape pressed');
      }
    });
  }

  onMouseEnter(event) {
    event.preventDefault();
  }

  onMouseOver(event) {
    event.preventDefault();
  }

  onMouseLeave(event) {
    event.preventDefault();
  }

  onMouseMove(event) {
    event.preventDefault();
  }

  onMouseUp(event) {
    event.preventDefault();
  }
}
