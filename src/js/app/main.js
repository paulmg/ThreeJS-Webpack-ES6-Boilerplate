// global imports
import THREE from 'three';
import TWEEN from 'tween.js';

// local imports
import Renderer from './renderer';
import Camera from './camera';
import Light from './light';
import Controls from './controls';
import Geometry from './geometry';
import Texture from './texture';
import Model from './model';
import Interaction from './interaction';
import GUI from './gui';

// data
import Config from './../data/config';

// stats
let rS, bS, glS, tS;

export default class Main {
  constructor(container) {
    this.container = container;

    // Start Three clock
    this.clock = new THREE.Clock();

    // Main scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(Config.fog.color, Config.fog.near);

    // Get Device Pixel Ratio first
    if(window.devicePixelRatio) {
      Config.dpr = window.devicePixelRatio;
    }

    // Main renderer
    this.renderer = new Renderer(container, this.scene);

    // Components
    this.camera = new Camera(this.renderer.threeRenderer);
    this.controls = new Controls(this.camera.threeCamera, this.container);
    this.light = new Light(this.scene);

    // Place lights
    const lights = ['ambient', 'directional', 'point', 'hemi'];
    for(let i = 0; i < lights.length; i++) {
      this.light.place(lights[i]);
    }

    // Place geo
    this.geometry = new Geometry(this.scene);
    this.geometry.make('plane')(100, 100, 10, 10);
    this.geometry.place([0, -20, 0], [Math.PI/2, 0, 0]);

    // Set up stats if dev
    if(Config.isDev) {
      bS = new BrowserStats();
      glS = new glStats();
      tS = new threeStats(this.renderer.threeRenderer);

      rS = new rStats({
        CSSPath: '/assets/css/',
        userTimingAPI: true,
        values: {
          frame: { caption: 'Total frame time (ms)', over: 16, average: true, avgMs: 100 },
          fps: { caption: 'Framerate (FPS)', below: 30 },
          calls: { caption: 'Calls (three.js)', over: 3000 },
          raf: { caption: 'Time since last rAF (ms)', average: true, avgMs: 100 },
          rstats: { caption: 'rStats update (ms)', average: true, avgMs: 100 },
          texture: { caption: 'GenTex', average: true, avgMs: 100 }
        },
        groups: [
          { caption: 'Framerate', values: [ 'fps', 'raf' ] },
          { caption: 'Frame Budget', values: [ 'frame', 'texture', 'setup', 'render' ] }
        ],
        fractions: [
          { base: 'frame', steps: [ 'texture', 'setup', 'render' ] }
        ],
        plugins: [bS, tS, glS]
      });
    }

    this.texture = new Texture();
    // Start loading the textures
    this.texture.load().then(() => {
      this.manager = new THREE.LoadingManager();
      // Textures loaded, load main model
      this.model = new Model(this.scene, this.manager, this.texture.textures);
      this.model.load();

      // onProgress
      this.manager.onProgress = (item, loaded, total) => {
        console.log(`${item}: ${loaded} ${total}`);
      };

      // All loaders done
      this.manager.onLoad = () => {
        // Set up interaction with app
        new Interaction(this.renderer.threeRenderer, this.scene, this.camera.threeCamera, this.controls.threeControls);

        if(Config.isDev) {
          new GUI(this, this.model.obj);
        }

        Config.isLoaded = true;
      };
    });

    this.render();
  }

  render() {
    const delta = this.clock.getDelta();

    if(Config.isDev) {
      rS('frame').start();
      glS.start();

      rS('rAF').tick();
      rS('FPS').frame();

      rS('render').start();
    }

    // Clear renderer
    this.renderer.threeRenderer.clear();
    this.renderer.render(this.scene, this.camera.threeCamera);

    if(Config.isDev) {
      rS('render').end();
      rS('frame').end();

      rS('rStats').start();
      rS().update();
      rS('rStats').end();
    }

    // Updates
    TWEEN.update();
    this.controls.threeControls.update();

    // raf
    requestAnimationFrame(this.render.bind(this));
  }
}
