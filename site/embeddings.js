// Note: model_cp_name is defined in the HTML file before including this script.

const container = document.getElementById('threejs-container'); // Attach to specific element

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

// Controls
let controls;

function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
    // Implement touch controls for mobile
    let touchX, touchY;
    let isTouching = false;
    let previousDistance = null;

    container.addEventListener('touchstart', function(event) {
        event.preventDefault(); // Prevent default touch behavior
        if (event.touches.length == 1) {
            isTouching = true;
            touchX = event.touches[0].clientX;
            touchY = event.touches[0].clientY;
        } else if (event.touches.length == 2) {
            // Handle pinch to move forward/backward
            previousDistance = getDistance(event.touches[0], event.touches[1]);
        }
    }, { passive: false }); // Set passive to false

    container.addEventListener('touchmove', function(event) {
        event.preventDefault(); // Prevent default touch behavior
        if (isTouching && event.touches.length == 1) {
            let deltaX = event.touches[0].clientX - touchX;
            let deltaY = event.touches[0].clientY - touchY;

            let rotationSpeed = 0.005;

            camera.rotation.y -= deltaX * rotationSpeed;
            camera.rotation.x -= deltaY * rotationSpeed;

            touchX = event.touches[0].clientX;
            touchY = event.touches[0].clientY;
        } else if (event.touches.length == 2) {
            // Handle pinch to move forward/backward
            let currentDistance = getDistance(event.touches[0], event.touches[1]);
            let deltaDistance = currentDistance - previousDistance;

            let moveSpeed = 0.05;
            camera.translateZ(-deltaDistance * moveSpeed);

            previousDistance = currentDistance;
        }
    }, { passive: false });

    container.addEventListener('touchend', function(event) {
        event.preventDefault(); // Prevent default touch behavior
        if (event.touches.length == 0) {
            isTouching = false;
            previousDistance = null;
        }
    }, { passive: false });

    function getDistance(touch1, touch2) {
        let dx = touch1.clientX - touch2.clientX;
        let dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

} else {
    // Use PointerLockControls for desktop
    controls = new THREE.PointerLockControls(camera, document.body);

    container.addEventListener('click', () => {
        controls.lock();
    });

    scene.add(controls.getObject());

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
        move(); // Apply movement for desktop
        renderer.render(scene, camera);
    }
    animate();
}

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
    const jsonFilePath = "embeddings/image_data_" + model_cp_name + ".json";

    // Fetch the JSON file that contains image data
    fetch(jsonFilePath)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const imagePath = "embeddings/images_" + model_cp_name + "/" + item.path; // As per your request
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
