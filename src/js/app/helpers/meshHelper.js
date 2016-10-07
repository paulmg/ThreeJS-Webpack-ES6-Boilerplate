import * as THREE from 'three';

// Simple mesh helper that shows edges, wireframes, and face and vertex normals
export default class MeshHelper {
  constructor(scene, mesh) {
    const wireframe = new THREE.WireframeGeometry(mesh.geometry);
    const wireLine = new THREE.LineSegments(wireframe);
    wireLine.material.depthTest = false;
    wireLine.material.opacity = 0.25;
    wireLine.material.transparent = true;
    mesh.add(wireLine);

    const edges = new THREE.EdgesGeometry(mesh.geometry);
    const edgesLine = new THREE.LineSegments(edges);
    edgesLine.material.depthTest = false;
    edgesLine.material.opacity = 0.25;
    edgesLine.material.transparent = true;
    mesh.add(edgesLine);

    scene.add(new THREE.BoxHelper(mesh));
    scene.add(new THREE.FaceNormalsHelper(mesh, 2));
    scene.add(new THREE.VertexNormalsHelper(mesh, 2));
  }
}
