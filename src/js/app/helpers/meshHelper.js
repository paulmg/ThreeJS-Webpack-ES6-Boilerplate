import * as THREE from 'three';
import { VertexNormalsHelper } from './vertexNormalsHelper';

// Simple mesh helper that shows edges, wireframes, and face and vertex normals
export default class MeshHelper {
  constructor(scene, mesh) {
    this.mesh = mesh;
    this.scene = scene;

    const wireframe = new THREE.WireframeGeometry(this.mesh.geometry);
    this.wireLine = new THREE.LineSegments(wireframe);
    this.wireLine.material.depthTest = false;
    this.wireLine.material.opacity = 0.25;
    this.wireLine.material.transparent = true;

    const edges = new THREE.EdgesGeometry(this.mesh.geometry);
    this.edgesLine = new THREE.LineSegments(edges);
    this.edgesLine.material.depthTest = false;
    this.edgesLine.material.opacity = 0.25;
    this.edgesLine.material.transparent = true;

    this.vertexHelper = new VertexNormalsHelper(this.mesh, 2);
    this.boxHelper = new THREE.BoxHelper(this.mesh);
  }

  enable() {
    this.mesh.add(this.wireLine);
    this.mesh.add(this.edgesLine);

    this.scene.add(this.vertexHelper);
    this.scene.add(this.boxHelper);
  }

  disable() {
    this.mesh.remove(this.wireLine);
    this.mesh.remove(this.edgesLine);

    this.scene.remove(this.vertexHelper);
    this.scene.remove(this.boxHelper);
  }
}
