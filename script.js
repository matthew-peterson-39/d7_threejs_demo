// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// Enable physically correct lighting
renderer.physicallyCorrectLights = true;
document.body.appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Add environment map
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMap = cubeTextureLoader.load([
    'https://threejs.org/examples/textures/cube/Bridge2/posx.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/negx.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/posy.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/negy.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/posz.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/negz.jpg'
]);
scene.environment = envMap;
scene.background = envMap;

// Create objects with different materials
// Standard metal sphere
const metalGeometry = new THREE.SphereGeometry(1, 32, 32);
const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 1,
    roughness: 0.2,
    envMap: envMap
});
const metalSphere = new THREE.Mesh(metalGeometry, metalMaterial);
metalSphere.position.x = -2.5;
scene.add(metalSphere);

// Glass-like sphere using Physical material
const glassGeometry = new THREE.SphereGeometry(1, 32, 32);
const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0,
    transmission: 0.9,
    transparent: true,
    envMap: envMap,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    ior: 1.5
});
const glassSphere = new THREE.Mesh(glassGeometry, glassMaterial);
scene.add(glassSphere);

// Rough plastic-like sphere
const plasticGeometry = new THREE.SphereGeometry(1, 32, 32);
const plasticMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    metalness: 0,
    roughness: 0.7,
    envMap: envMap
});
const plasticSphere = new THREE.Mesh(plasticGeometry, plasticMaterial);
plasticSphere.position.x = 2.5;
scene.add(plasticSphere);

// Position camera
camera.position.z = 8;

// Add simple orbit controls
let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

document.addEventListener('mousedown', (e) => {
    isDragging = true;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };

        scene.rotation.y += deltaMove.x * 0.01;
        scene.rotation.x += deltaMove.y * 0.01;
    }

    previousMousePosition = {
        x: e.clientX,
        y: e.clientY
    };
});

document.addEventListener('mouseup', (e) => {
    isDragging = false;
});

// Add zoom with mouse wheel
document.addEventListener('wheel', (e) => {
    camera.position.z += e.deltaY * 0.01;
    // Limit zoom
    camera.position.z = Math.max(4, Math.min(20, camera.position.z));
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate spheres slowly
    metalSphere.rotation.y += 0.01;
    glassSphere.rotation.y += 0.01;
    plasticSphere.rotation.y += 0.01;
    
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}