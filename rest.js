// main.js
import * as THREE from 'three';
import { Refractor } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { buffer, color } from 'three/tsl';

// === Scene ===
const scene = new THREE.Scene();

// === Camera ===
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(10, 5, 10);
camera.rotation.set();

// === Renderer ===
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// === Controls ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// === Audio Listener & Loader===
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();

audioLoader.load(
    'music/Dirtmouth.mp3', (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.25);
        sound.play();
    }
)

let audioStarted = false;

document.addEventListener('click', async () => {
    if (!audioStarted) {
        if (listener.context.state === 'suspended') {
            await listener.context.resume();
        }
        if (!sound.isPlaying && sound.buffer) {
            sound.play();
        }
        audioStarted = true;
    }
});



// === Loaders ===
const gltfLoader = new GLTFLoader();

// Bench model
gltfLoader.load(
    'models/bench/scene.gltf',
    (gltf) => {
        const model = gltf.scene;
        model.scale.set(2, 2, 2); // Try larger if necessary
        scene.add(model);
    }
);

// === Light Model ===
gltfLoader.load(
    'models/streetlight/scene.gltf',
    (gltf) => {
        const model = gltf.scene;
        model.rotation.y = 10;
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        scene.add(model);
    }
);

// Ground Model
// const groundGeometry = new THREE.BoxGeometry(30, 0.01, 30);
// const groundMaterial = new THREE.MeshLambertMaterial({ color: "#876e2a" });
// const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
// scene.add(groundMesh);

// === Lights ===
const light = new THREE.AmbientLight();
light.position.set(10, 5, 0);
scene.add(light);

const blueLight = new THREE.PointLight(0x66ccff, 1, 60); // color, intensity, distance
blueLight.position.set(0, 5, 0); // Same spot as your streetlight
scene.add(blueLight);

// === Fog ===
scene.fog = new THREE.Fog(0x0d0d1a, 5, 25);

// === Particles ===
const particleCount = 100;
const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 30; // x
    positions[i * 3 + 1] = Math.random() * 10 + 5;      // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30; // z
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({
    color: 0x88ccff,
    size: 0.1,
    transparent: true,
    opacity: 0.6
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);


// === Resize Handling ===
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// === Animation Loop ===
function animate() {
    requestAnimationFrame(animate);

    const pos = particles.geometry.attributes.position;

    for (let i = 0; i < pos.count; i++) {
        pos.array[i * 3 + 1] -= 0.05; // move down
        if (pos.array[i * 3 + 1] < 0) {
            pos.array[i * 3 + 1] = 10 + Math.random() * 5; // respawn higher
        }
    }

    pos.needsUpdate = true;

    controls.update();
    renderer.render(scene, camera);
}

animate();