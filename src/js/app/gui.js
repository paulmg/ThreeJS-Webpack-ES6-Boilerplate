import Config from './../data/config';

export default class GUI {
  constructor(main, mesh) {
    let gui = new dat.GUI();

    this.camera = main.camera.threeCamera;
    this.controls = main.controls.threeControls;
    this.light = main.light;

    /* Global */
    //gui.close();

    /* Camera */
    let cameraFolder = gui.addFolder('Camera');
    let cameraFOVGui = cameraFolder.add(Config.camera, 'fov', 0, 180).name('Camera FOV');
    cameraFOVGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.camera.fov = value;
    });
    cameraFOVGui.onFinishChange((value) => {
      this.camera.updateProjectionMatrix();

      this.controls.enableRotate = true;
    });
    let cameraAspectGui = cameraFolder.add(Config.camera, 'aspect', 0, 4).name('Camera Aspect');
    cameraAspectGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.camera.aspect = value;
    });
    cameraAspectGui.onFinishChange((value) => {
      this.camera.updateProjectionMatrix();

      this.controls.enableRotate = true;
    });
    let cameraFogColorGui = cameraFolder.addColor(Config.fog, 'color').name('Fog Color');
    cameraFogColorGui.onChange((value) => {
      main.scene.fog.color.setHex(value);
    });
    let cameraFogNearGui = cameraFolder.add(Config.fog, 'near', 0.000, 0.010).name('Fog Near');
    cameraFogNearGui.onChange((value) => {
      this.controls.enableRotate = false;

      main.scene.fog.density = value;
    });
    cameraFogNearGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
    });


    /* Controls */
    let controlsFolder = gui.addFolder('Controls');
    controlsFolder.add(Config.controls, 'autoRotate').name('Auto Rotate').onChange((value) => {
      this.controls.autoRotate = value;
    });
    let controlsAutoRotateSpeedGui = controlsFolder.add(Config.controls, 'autoRotateSpeed', -1, 1).name('Rotation Speed');
    controlsAutoRotateSpeedGui.onChange((value) => {
      this.controls.enableRotate = false;
      this.controls.autoRotateSpeed = value;
    });
    controlsAutoRotateSpeedGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
    });


    /* Mesh */
    let meshFolder = gui.addFolder('Mesh');
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
    let ambientLightFolder = gui.addFolder('Ambient Light');
    ambientLightFolder.add(Config.ambientLight, 'enabled').name('Enabled').onChange((value) => {
      this.light.ambientLight.visible = value;
    });
    ambientLightFolder.addColor(Config.ambientLight, 'color').name('Color').onChange((value) => {
      this.light.ambientLight.color.setHex(value);
    });


    // Directional Light
    let directionalLightFolder = gui.addFolder('Directional Light');
    directionalLightFolder.add(Config.directionalLight, 'enabled').name('Enabled').onChange((value) => {
      this.light.directionalLight.visible = value;
    });
    directionalLightFolder.addColor(Config.directionalLight, 'color').name('Color').onChange((value) => {
      this.light.directionalLight.color.setHex(value);
    });
    let directionalLightIntensityGui = directionalLightFolder.add(Config.directionalLight, 'intensity', 0, 2).name('Intensity');
    directionalLightIntensityGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.intensity = value;
    });
    directionalLightIntensityGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
    });
    let directionalLightPositionXGui = directionalLightFolder.add(Config.directionalLight, 'x', -1000, 1000).name('Position X');
    directionalLightPositionXGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.position.x = value;
    });
    directionalLightPositionXGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
    });
    let directionalLightPositionYGui = directionalLightFolder.add(Config.directionalLight, 'y', -1000, 1000).name('Position Y');
    directionalLightPositionYGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.position.y = value;
    });
    directionalLightPositionYGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
    });
    let directionalLightPositionZGui = directionalLightFolder.add(Config.directionalLight, 'z', -1000, 1000).name('Position Z');
    directionalLightPositionZGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.position.z = value;
    });
    directionalLightPositionZGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
    });

    // Shadow Map
    let shadowFolder = gui.addFolder('Shadow Map');
    shadowFolder.add(Config.shadow, 'enabled').name('Enabled').onChange((value) => {
      this.light.directionalLight.castShadow = value;
    });
    shadowFolder.add(Config.shadow, 'helperEnabled').name('Helper Enabled').onChange((value) => {
      this.light.directionalLightHelper.visible = value;
    });
    let shadowNearGui = shadowFolder.add(Config.shadow, 'near', 0, 100).name('Near');
    shadowNearGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.shadow.camera.near = value;
    });
    shadowNearGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
      this.light.directionalLight.shadow.map.dispose();
      this.light.directionalLight.shadow.map = null;
      this.light.directionalLightHelper.update();
    });
    let shadowFarGui = shadowFolder.add(Config.shadow, 'far', 0, 1200).name('Far');
    shadowFarGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.shadow.camera.far = value;
    });
    shadowFarGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
      this.light.directionalLight.shadow.map.dispose();
      this.light.directionalLight.shadow.map = null;
      this.light.directionalLightHelper.update();
    });
    let shadowTopGui = shadowFolder.add(Config.shadow, 'top', -400, 400).name('Top');
    shadowTopGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.shadow.camera.top = value;
    });
    shadowTopGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
      this.light.directionalLight.shadow.map.dispose();
      this.light.directionalLight.shadow.map = null;
      this.light.directionalLightHelper.update();
    });
    let shadowRightGui = shadowFolder.add(Config.shadow, 'right', -400, 400).name('Right');
    shadowRightGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.shadow.camera.right = value;
    });
    shadowRightGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
      this.light.directionalLight.shadow.map.dispose();
      this.light.directionalLight.shadow.map = null;
      this.light.directionalLightHelper.update();
    });
    let shadowBottomGui = shadowFolder.add(Config.shadow, 'bottom', -400, 400).name('Bottom');
    shadowBottomGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.shadow.camera.bottom = value;
    });
    shadowBottomGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
      this.light.directionalLight.shadow.map.dispose();
      this.light.directionalLight.shadow.map = null;
      this.light.directionalLightHelper.update();
    });
    let shadowLeftGui = shadowFolder.add(Config.shadow, 'left', -400, 400).name('Left');
    shadowLeftGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.shadow.camera.left = value;
    });
    shadowLeftGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
      this.light.directionalLight.shadow.map.dispose();
      this.light.directionalLight.shadow.map = null;
      this.light.directionalLightHelper.update();
    });
    let shadowBiasGui = shadowFolder.add(Config.shadow, 'bias', -0.000010, 1).name('Bias');
    shadowBiasGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.directionalLight.shadow.bias = value;
    });
    shadowBiasGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
      this.light.directionalLight.shadow.map.dispose();
      this.light.directionalLight.shadow.map = null;
      this.light.directionalLightHelper.update();
    });


    // Point Light
    let pointLightFolder = gui.addFolder('Point Light');
    pointLightFolder.add(Config.pointLight, 'enabled').name('Enabled').onChange((value) => {
      this.light.pointLight.visible = value;
    });
    pointLightFolder.addColor(Config.pointLight, 'color').name('Color').onChange((value) => {
      this.light.pointLight.color.setHex(value);
    });
    let pointLightIntensityGui = pointLightFolder.add(Config.pointLight, 'intensity', 0, 2).name('Intensity');
    pointLightIntensityGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.pointLight.intensity = value;
    });
    pointLightIntensityGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
    });
    let pointLightDistanceGui = pointLightFolder.add(Config.pointLight, 'distance', 0, 1000).name('Distance');
    pointLightDistanceGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.pointLight.distance = value;
    });
    pointLightDistanceGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
    });
    let pointLightPositionXGui = pointLightFolder.add(Config.pointLight, 'x', -1000, 1000).name('Position X');
    pointLightPositionXGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.pointLight.position.x = value;
    });
    pointLightPositionXGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
    });
    let pointLightPositionYGui = pointLightFolder.add(Config.pointLight, 'y', -1000, 1000).name('Position Y');
    pointLightPositionYGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.pointLight.position.y = value;
    });
    pointLightPositionYGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
    });
    let pointLightPositionZGui = pointLightFolder.add(Config.pointLight, 'z', -1000, 1000).name('Position Z');
    pointLightPositionZGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.pointLight.position.z = value;
    });
    pointLightPositionZGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
    });


    // Hemi Light
    let hemiLightFolder = gui.addFolder('Hemi Light');
    hemiLightFolder.add(Config.hemiLight, 'enabled').name('Enabled').onChange((value) => {
      this.light.hemiLight.visible = value;
    });
    hemiLightFolder.addColor(Config.hemiLight, 'color').name('Color').onChange((value) => {
      this.light.hemiLight.color.setHex(value);
    });
    hemiLightFolder.addColor(Config.hemiLight, 'groundColor').name('ground Color').onChange((value) => {
      this.light.hemiLight.groundColor.setHex(value);
    });
    let hemiLightIntensityGui = hemiLightFolder.add(Config.hemiLight, 'intensity', 0, 2).name('Intensity');
    hemiLightIntensityGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.hemiLight.intensity = value;
    });
    hemiLightIntensityGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
    });
    let hemiLightPositionXGui = hemiLightFolder.add(Config.hemiLight, 'x', -1000, 1000).name('Position X');
    hemiLightPositionXGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.hemiLight.position.x = value;
    });
    hemiLightPositionXGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
    });
    let hemiLightPositionYGui = hemiLightFolder.add(Config.hemiLight, 'y', -500, 1000).name('Position Y');
    hemiLightPositionYGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.hemiLight.position.y = value;
    });
    hemiLightPositionYGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
    });
    let hemiLightPositionZGui = hemiLightFolder.add(Config.hemiLight, 'z', -1000, 1000).name('Position Z');
    hemiLightPositionZGui.onChange((value) => {
      this.controls.enableRotate = false;

      this.light.hemiLight.position.z = value;
    });
    hemiLightPositionZGui.onFinishChange((value) => {
      this.controls.enableRotate = true;
    });
  }

  handleColorChange(color) {
    return (value) => {
      if(typeof value === 'string') {
        value = value.replace('#', '0x');
      }

      color.setHex(value);
    };
  }

  needsUpdate(material, geometry) {
    return function() {
      material.shading = +material.shading; //Ensure number
      material.vertexColors = +material.vertexColors; //Ensure number
      material.side = +material.side; //Ensure number
      material.needsUpdate = true;
      geometry.verticesNeedUpdate = true;
      geometry.normalsNeedUpdate = true;
      geometry.colorsNeedUpdate = true;
    };
  }

  updateTexture(material, materialKey, textures) {
    return function(key) {
      material[materialKey] = textures[key];
      material.needsUpdate = true;
    };
  }

  update() {
    this.needsUpdate(mesh.material, mesh.geometry);
  }
}
