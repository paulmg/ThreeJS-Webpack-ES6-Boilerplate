import Config from '../../data/config';

// Manages all dat.GUI interactions
export default class DatGUI {
  constructor(main) {
    this.gui = new dat.GUI();

    this.camera = main.camera.threeCamera;
    this.controls = main.controls.threeControls;
    this.light = main.light;
    this.scene = main.scene;

    this.model = null;
    this.meshHelper = null;
  }

  load(main, mesh) {
    /* Global */
    //this.gui.close();

    this.model = main.model;
    this.meshHelper = main.meshHelper;

    /* Camera */
    const cameraFolder = this.gui.addFolder('Camera');
    const cameraFOVGui = cameraFolder.add(Config.camera, 'fov', 0, 180).name('Camera FOV');
    cameraFOVGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.camera.fov = value;
    });
    cameraFOVGui.onFinishChange(() => {
      this.camera.updateProjectionMatrix();

      this.controls.enableRotate = true;
    });
    const cameraAspectGui = cameraFolder.add(Config.camera, 'aspect', 0, 4).name('Camera Aspect');
    cameraAspectGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.camera.aspect = value;
    });
    cameraAspectGui.onFinishChange(() => {
      this.camera.updateProjectionMatrix();

      this.controls.enableRotate = true;
    });
    const cameraFogColorGui = cameraFolder.addColor(Config.fog, 'color').name('Fog Color');
    cameraFogColorGui.onChange((value) => {
      this.scene.fog.color.setHex(value);
    });
    const cameraFogNearGui = cameraFolder.add(Config.fog, 'near', 0.000, 0.010).name('Fog Near');
    cameraFogNearGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.scene.fog.density = value;
    });
    cameraFogNearGui.onFinishChange(() => {
      this.controls.enableRotate = true;
    });


    /* Controls */
    const controlsFolder = this.gui.addFolder('Controls');
    controlsFolder.add(Config.controls, 'autoRotate').name('Auto Rotate').onChange((value) => {
      this.controls.autoRotate = value;
    });
    const controlsAutoRotateSpeedGui = controlsFolder.add(Config.controls, 'autoRotateSpeed', -1, 1).name('Rotation Speed');
    controlsAutoRotateSpeedGui.onChange((value) => {
      this.controls.enableRotate = false;
      this.controls.autoRotateSpeed = value;
    });
    controlsAutoRotateSpeedGui.onFinishChange(() => {
      this.controls.enableRotate = true;
    });


    /* Model */
    const modelFolder = this.gui.addFolder('Model');
    modelFolder.add(Config.model, 'type', [...Config.model.initialTypes]).name('Select Model').onChange((value) => {
      if (value) {
        if (Config.mesh.enableHelper)
          this.meshHelper.disable();

        Config.model.selected = Config.model.initialTypes.indexOf(value);
        this.unload();
        this.model.unload();
        this.model.load(value);
      }
    });

    /* Mesh */
    const meshFolder = this.gui.addFolder('Mesh');
    meshFolder.add(Config.mesh, 'enableHelper', true).name('Enable Helpers').onChange((value) => {
      if(value) {
        this.meshHelper.enable();
      } else {
        this.meshHelper.disable();
      }
    });
    meshFolder.add(Config.mesh, 'translucent', true).name('Translucent').onChange((value) => {
      if(value) {
        mesh.material.transparent = true;
        mesh.material.opacity = 0.5;
      } else {
        mesh.material.opacity = 1.0;
      }
    });
    meshFolder.add(Config.mesh, 'wireframe', true).name('Wireframe').onChange((value) => {
      mesh.material.wireframe = value;
    });


    /* Lights */
    // Ambient Light
    const ambientLightFolder = this.gui.addFolder('Ambient Light');
    ambientLightFolder.add(Config.ambientLight, 'enabled').name('Enabled').onChange((value) => {
      this.light.ambientLight.visible = value;
    });
    ambientLightFolder.addColor(Config.ambientLight, 'color').name('Color').onChange((value) => {
      this.light.ambientLight.color.setHex(value);
    });


    // Directional Light
    const directionalLightFolder = this.gui.addFolder('Directional Light');
    directionalLightFolder.add(Config.directionalLight, 'enabled').name('Enabled').onChange((value) => {
      this.light.directionalLight.visible = value;
    });
    directionalLightFolder.addColor(Config.directionalLight, 'color').name('Color').onChange((value) => {
      this.light.directionalLight.color.setHex(value);
    });
    const directionalLightIntensityGui = directionalLightFolder.add(Config.directionalLight, 'intensity', 0, 2).name('Intensity');
    directionalLightIntensityGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.intensity = value;
    });
    directionalLightIntensityGui.onFinishChange(() => {
      this.controls.enableRotate = true;
    });
    const directionalLightPositionXGui = directionalLightFolder.add(Config.directionalLight, 'x', -1000, 1000).name('Position X');
    directionalLightPositionXGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.position.x = value;
    });
    directionalLightPositionXGui.onFinishChange(() => {
      this.controls.enableRotate = true;
    });
    const directionalLightPositionYGui = directionalLightFolder.add(Config.directionalLight, 'y', -1000, 1000).name('Position Y');
    directionalLightPositionYGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.position.y = value;
    });
    directionalLightPositionYGui.onFinishChange(() => {
      this.controls.enableRotate = true;
    });
    const directionalLightPositionZGui = directionalLightFolder.add(Config.directionalLight, 'z', -1000, 1000).name('Position Z');
    directionalLightPositionZGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.position.z = value;
    });
    directionalLightPositionZGui.onFinishChange(() => {
      this.controls.enableRotate = true;
    });

    // Shadow Map
    const shadowFolder = this.gui.addFolder('Shadow Map');
    shadowFolder.add(Config.shadow, 'enabled').name('Enabled').onChange((value) => {
      this.light.directionalLight.castShadow = value;
    });
    shadowFolder.add(Config.shadow, 'helperEnabled').name('Helper Enabled').onChange((value) => {
      this.light.directionalLightHelper.visible = value;
    });
    const shadowNearGui = shadowFolder.add(Config.shadow, 'near', 0, 400).name('Near');
    shadowNearGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.shadow.camera.near = value;
    });
    shadowNearGui.onFinishChange(() => {
      this.controls.enableRotate = true;
      this.light.directionalLight.shadow.map.dispose();
      this.light.directionalLight.shadow.map = null;
      this.light.directionalLightHelper.update();
    });
    const shadowFarGui = shadowFolder.add(Config.shadow, 'far', 0, 1200).name('Far');
    shadowFarGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.shadow.camera.far = value;
    });
    shadowFarGui.onFinishChange(() => {
      this.controls.enableRotate = true;
      this.light.directionalLight.shadow.map.dispose();
      this.light.directionalLight.shadow.map = null;
      this.light.directionalLightHelper.update();
    });
    const shadowTopGui = shadowFolder.add(Config.shadow, 'top', -400, 400).name('Top');
    shadowTopGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.shadow.camera.top = value;
    });
    shadowTopGui.onFinishChange(() => {
      this.controls.enableRotate = true;
      this.light.directionalLight.shadow.map.dispose();
      this.light.directionalLight.shadow.map = null;
      this.light.directionalLightHelper.update();
    });
    const shadowRightGui = shadowFolder.add(Config.shadow, 'right', -400, 400).name('Right');
    shadowRightGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.shadow.camera.right = value;
    });
    shadowRightGui.onFinishChange(() => {
      this.controls.enableRotate = true;
      this.light.directionalLight.shadow.map.dispose();
      this.light.directionalLight.shadow.map = null;
      this.light.directionalLightHelper.update();
    });
    const shadowBottomGui = shadowFolder.add(Config.shadow, 'bottom', -400, 400).name('Bottom');
    shadowBottomGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.shadow.camera.bottom = value;
    });
    shadowBottomGui.onFinishChange(() => {
      this.controls.enableRotate = true;
      this.light.directionalLight.shadow.map.dispose();
      this.light.directionalLight.shadow.map = null;
      this.light.directionalLightHelper.update();
    });
    const shadowLeftGui = shadowFolder.add(Config.shadow, 'left', -400, 400).name('Left');
    shadowLeftGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.shadow.camera.left = value;
    });
    shadowLeftGui.onFinishChange(() => {
      this.controls.enableRotate = true;
      this.light.directionalLight.shadow.map.dispose();
      this.light.directionalLight.shadow.map = null;
      this.light.directionalLightHelper.update();
    });
    const shadowBiasGui = shadowFolder.add(Config.shadow, 'bias', -0.000010, 1).name('Bias');
    shadowBiasGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.shadow.bias = value;
    });
    shadowBiasGui.onFinishChange(() => {
      this.controls.enableRotate = true;
      this.light.directionalLight.shadow.map.dispose();
      this.light.directionalLight.shadow.map = null;
      this.light.directionalLightHelper.update();
    });


    // Point Light
    const pointLightFolder = this.gui.addFolder('Point Light');
    pointLightFolder.add(Config.pointLight, 'enabled').name('Enabled').onChange((value) => {
      this.light.pointLight.visible = value;
    });
    pointLightFolder.addColor(Config.pointLight, 'color').name('Color').onChange((value) => {
      this.light.pointLight.color.setHex(value);
    });
    const pointLightIntensityGui = pointLightFolder.add(Config.pointLight, 'intensity', 0, 2).name('Intensity');
    pointLightIntensityGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.pointLight.intensity = value;
    });
    pointLightIntensityGui.onFinishChange(() => {
      this.controls.enableRotate = true;
    });
    const pointLightDistanceGui = pointLightFolder.add(Config.pointLight, 'distance', 0, 1000).name('Distance');
    pointLightDistanceGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.pointLight.distance = value;
    });
    pointLightDistanceGui.onFinishChange(() => {
      this.controls.enableRotate = true;
    });
    const pointLightPositionXGui = pointLightFolder.add(Config.pointLight, 'x', -1000, 1000).name('Position X');
    pointLightPositionXGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.pointLight.position.x = value;
    });
    pointLightPositionXGui.onFinishChange(() => {
      this.controls.enableRotate = true;
    });
    const pointLightPositionYGui = pointLightFolder.add(Config.pointLight, 'y', -1000, 1000).name('Position Y');
    pointLightPositionYGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.pointLight.position.y = value;
    });
    pointLightPositionYGui.onFinishChange(() => {
      this.controls.enableRotate = true;
    });
    const pointLightPositionZGui = pointLightFolder.add(Config.pointLight, 'z', -1000, 1000).name('Position Z');
    pointLightPositionZGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.pointLight.position.z = value;
    });
    pointLightPositionZGui.onFinishChange(() => {
      this.controls.enableRotate = true;
    });


    // Hemi Light
    const hemiLightFolder = this.gui.addFolder('Hemi Light');
    hemiLightFolder.add(Config.hemiLight, 'enabled').name('Enabled').onChange((value) => {
      this.light.hemiLight.visible = value;
    });
    hemiLightFolder.addColor(Config.hemiLight, 'color').name('Color').onChange((value) => {
      this.light.hemiLight.color.setHex(value);
    });
    hemiLightFolder.addColor(Config.hemiLight, 'groundColor').name('ground Color').onChange((value) => {
      this.light.hemiLight.groundColor.setHex(value);
    });
    const hemiLightIntensityGui = hemiLightFolder.add(Config.hemiLight, 'intensity', 0, 2).name('Intensity');
    hemiLightIntensityGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.hemiLight.intensity = value;
    });
    hemiLightIntensityGui.onFinishChange(() => {
      this.controls.enableRotate = true;
    });
    const hemiLightPositionXGui = hemiLightFolder.add(Config.hemiLight, 'x', -1000, 1000).name('Position X');
    hemiLightPositionXGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.hemiLight.position.x = value;
    });
    hemiLightPositionXGui.onFinishChange(() => {
      this.controls.enableRotate = true;
    });
    const hemiLightPositionYGui = hemiLightFolder.add(Config.hemiLight, 'y', -500, 1000).name('Position Y');
    hemiLightPositionYGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.hemiLight.position.y = value;
    });
    hemiLightPositionYGui.onFinishChange(() => {
      this.controls.enableRotate = true;
    });
    const hemiLightPositionZGui = hemiLightFolder.add(Config.hemiLight, 'z', -1000, 1000).name('Position Z');
    hemiLightPositionZGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.hemiLight.position.z = value;
    });
    hemiLightPositionZGui.onFinishChange(() => {
      this.controls.enableRotate = true;
    });
  }

  unload() {
    this.gui.destroy();
    this.gui = new dat.GUI();
  }
}
