import Keyboard from '../../utils/keyboard';
import Helpers from '../../utils/helpers';
import Config from '../../data/config';

// Manages all input interactions
export default class Interaction {
  constructor(renderer, scene, camera, controls, stats, gui) {
    // Properties
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.stats = stats;
    this.gui = gui.gui;

    this.timeout = null;

    // Instantiate keyboard helper
    this.keyboard = new Keyboard();

    // Listeners
    // Mouse events
    this.renderer.domElement.addEventListener('mousemove', (event) => Helpers.throttle(this.onMouseMove(event), 250), false);
    this.renderer.domElement.addEventListener('mouseleave', (event) => this.onMouseLeave(event), false);
    this.renderer.domElement.addEventListener('mouseover', (event) => this.onMouseOver(event), false);

    // Keyboard events
    this.keyboard.domElement.addEventListener('keydown', (event) => {
      // Only once
      if(event.repeat) {
        return;
      }

      if(this.keyboard.eventMatches(event, 'escape')) {
        console.log('Escape pressed');
      }

      if(this.keyboard.eventMatches(event, 's')) {
        if(this.stats) {
          const stats = window.document.getElementsByClassName('rs-base')[0];
          if(stats.style.display === 'none')
          {
            stats.style.display = 'block';
          } else {
            stats.style.display = 'none';
          }
        }
      }

      if(this.keyboard.eventMatches(event, 'g')) {
        if(this.gui) {
          if(this.gui.closed){
            this.gui.open();
          } else {
            this.gui.close();
          }
        }
      }
    });
  }

  onMouseOver(event) {
    event.preventDefault();

    Config.isMouseOver = true;
  }

  onMouseLeave(event) {
    event.preventDefault();

    Config.isMouseOver = false;
  }

  onMouseMove(event) {
    event.preventDefault();

    clearTimeout(this.timeout);

    this.timeout = setTimeout(function() {
      Config.isMouseMoving = false;
    }, 200);

    Config.isMouseMoving = true;
  }
}
