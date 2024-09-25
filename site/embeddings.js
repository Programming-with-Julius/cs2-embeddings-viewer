const model_cp_name = "noble-water-17_epoch_4"; // Model name without .pth extension
//const model_cp_name = "absurd-shadow-34_epoch_9"; // Model name without .pth extension


const container = document.getElementById('threejs-container'); // Attach to specific element
container.addEventListener('click', () => {
    controls.lock();
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Set the camera's position
camera.position.set(72.47668130974937, 66.66374259366836, 5.5729928099521267);

// Set the camera's rotation (Euler angles in radians)
camera.rotation.set(2.9282309883834526, -0.08329763659969922, 3.13329729489135);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// Append the renderer to the specific container
container.appendChild(renderer.domElement);

// Add PointerLockControls
const controls = new THREE.PointerLockControls(camera, document.body);
scene.add(controls.getObject());

// Add lighting to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // White light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 0).normalize();
scene.add(directionalLight);

// Fullscreen functionality
document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyF') { // Check if the "F" key is pressed
        if (!document.fullscreenElement) {
            container.requestFullscreen(); // Enter fullscreen mode
        } else {
            document.exitFullscreen(); // Exit fullscreen mode
        }
    }
});

// Handle window resize and fullscreen change
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Listen to the resize event to adjust the renderer and camera
window.addEventListener('resize', onWindowResize);


// Function to load all images from the JSON file
function loadImages() {
    const loader = new THREE.TextureLoader();

    // Construct the JSON file path using the model_cp_name
    const jsonFilePath = "image_data_" + model_cp_name + ".json";

    // Fetch the JSON file that contains image data
    fetch(jsonFilePath)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const imagePath = "/embeddings/images_" + model_cp_name + "/" + item.path;
                const x = parseFloat(item.x) * 25;
                const y = parseFloat(item.y) * 25;
                const z = parseFloat(item.z) * 25;

                // Load the image and create a sprite
                const material = new THREE.SpriteMaterial({ map: loader.load(imagePath) });
                const sprite = new THREE.Sprite(material);

                // Set the sprite's position based on the coordinates in the JSON
                sprite.position.set(x, y, z);

                scene.add(sprite);
            });
        })
        .catch(error => console.error('Error loading images:', error));
}

loadImages();

const keyStates = {};

document.addEventListener('keydown', (event) => {
    keyStates[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keyStates[event.code] = false;
});

function move() {
    let moveSpeed = 1; // Default speed

    if (keyStates['ShiftLeft']) {
        moveSpeed = 0.1; // Slow speed when holding shift
    }

    if (keyStates['KeyW']) {
        controls.getObject().translateZ(-moveSpeed); // Move forward
    }
    if (keyStates['KeyS']) {
        controls.getObject().translateZ(moveSpeed); // Move backward
    }
    if (keyStates['KeyA']) {
        controls.getObject().translateX(-moveSpeed); // Strafe left
    }
    if (keyStates['KeyD']) {
        controls.getObject().translateX(moveSpeed); // Strafe right
    }
}

function animate() {
    requestAnimationFrame(animate);
    move(); // Apply movement
    renderer.render(scene, camera);
}

animate();
