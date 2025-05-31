import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/Addons.js';

const images = [
    'images/astronaut.jpg',
    'images/super_market1.png',
    'images/firewatch.jpg',
    'images/firewatch2.jpg',
    'images/pixel_city.jpg',
    'images/pixel NIGHT.jpg'
];


// setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

// texture-loader
const texLoader = new THREE.TextureLoader()

// spotlight
const spotlight = new THREE.SpotLight(0xffffff, 100.0, 10.0, 0.65, 0.4);
spotlight.position.set(0, 5, 0);
spotlight.target.position.set(0, 1, -5);
scene.add(spotlight);
scene.add(spotlight.target);

const mirror = new Reflector(
    new THREE.CircleGeometry(10),
    {
        color : 0x303030,
        textureWidth : window.innerWidth,
        textureHeight : window.innerHeight
    }
)
mirror.rotateX(-Math.PI / 2);
mirror.position.y = -1.25;
scene.add(mirror);

function animate() {
    renderer.render(scene, camera);
}

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setAnimationLoop(animate);


// root nodes and meshes
const rootNode = new THREE.Object3D();
scene.add(rootNode);

let count = 6;
for ( let i = 0; i < count; i++){
    const texture = texLoader.load(images[i]);

    const baseNode = new THREE.Object3D();
    baseNode.rotation.y = i * (2 * Math.PI / count);
    rootNode.add(baseNode);

    const border = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 2.2, 0.1),
        new THREE.MeshStandardMaterial({color: '#1e1e1e'})
    );
    border.position.z = -4.1;
    baseNode.add(border);

    const artwork = new THREE.Mesh(
        new THREE.BoxGeometry(3, 2, 0.1),
        new THREE.MeshStandardMaterial({map: texture})
    );
    artwork.position.z = -4;
    baseNode.add(artwork);

    const leftArrow = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.01),
        new THREE.MeshStandardMaterial({})
    );
    leftArrow.position.set(-1.9, 0, -4);
    baseNode.add(leftArrow);

    const rightArrow = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.01),
        new THREE.MeshStandardMaterial({})
    );
    rightArrow.position.set(1.9, 0, -4);
    baseNode.add(rightArrow);
}
