import THREE from 'three';

export default class Helper {
  constructor(scene, mesh) {
    let wireframe = new THREE.WireframeGeometry(mesh.geometry);
    let wireLine = new THREE.LineSegments(wireframe);
    wireLine.material.depthTest = false;
    wireLine.material.opacity = 0.25;
    wireLine.material.transparent = true;
    mesh.add(wireLine);

    let edges = new THREE.EdgesGeometry(mesh.geometry);
    let edgesLine = new THREE.LineSegments(edges);
    edgesLine.material.depthTest = false;
    edgesLine.material.opacity = 0.25;
    edgesLine.material.transparent = true;
    mesh.add(edgesLine);

    scene.add(new THREE.BoxHelper(mesh));
    scene.add(new THREE.FaceNormalsHelper(mesh, 2));
    scene.add(new THREE.VertexNormalsHelper(mesh, 2));
  }
}
