// Copy code to clipboard function
function copyCode(elementId) {
    const codeElement = document.getElementById(elementId);
    if (!codeElement) return;
    const textToCopy = codeElement.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Optional: Provide visual feedback like a temporary "Copied!" message
        const button = codeElement.nextElementSibling;
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check mr-1"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Typewriter effect for terminal simulator
document.addEventListener('DOMContentLoaded', () => {
    // createStars(); // Removed as Three.js handles stars

    const typewriterElements = document.querySelectorAll('.typewriter-text');
    typewriterElements.forEach((element, index) => {
        const text = element.getAttribute('data-text');
        element.innerHTML = `<span class="typewriter"></span>`;
        const span = element.querySelector('.typewriter');
        let i = 0;

        function type() {
            if (i < text.length) {
                span.textContent += text.charAt(i);
                i++;
                setTimeout(type, 20); // Adjust typing speed here
            } else {
                span.style.borderRight = 'none'; // Remove cursor when done
            }
        }
        // Start typing with a delay for each element
        setTimeout(type, 1500 * index);
    });

    // Intersection Observer for scroll-fade-in
    const fadeInElements = document.querySelectorAll('.scroll-fade-in');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeInElements.forEach(element => {
        observer.observe(element);
    });

    // Scroll-to-top button logic
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (scrollToTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        };

        scrollToTopBtn.addEventListener("click", function() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});

// --- 3D Space Background with Three.js ---

// Only run if three.js is loaded and canvas exists
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg');
    if (!window.THREE || !canvas) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 50000); // Increased far plane for larger scene
    camera.position.set(0, 0, 200); // Start camera further back to see the Sun
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);

    // OrbitControls for mouse interaction
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when damping is enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below the "ground"

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // --- Stars ---
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 20000; // More stars for a denser field
    const starVertices = [];
    for (let i = 0; i < starCount; i++) {
        const x = (Math.random() - 0.5) * 8000;
        const y = (Math.random() - 0.5) * 8000;
        const z = (Math.random() - 0.5) * 8000;
        starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // --- Solar System Objects ---
    const solarSystemGroup = new THREE.Group();
    scene.add(solarSystemGroup);

    // Sun
    const sunGeometry = new THREE.SphereGeometry(20, 64, 64); // Bigger sun
    const sunMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load('textures/sun.jpg') }); // Requires sun.jpg
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    solarSystemGroup.add(sun);

    // Sun Light
    const sunLight = new THREE.PointLight(0xffa500, 2, 0); // Orange-yellow light
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Planets (with more realistic relative sizes and distances)
    // Distances are scaled down for the scene, but relative sizes are maintained.
    const planetsData = [
        { name: 'Mercury', size: 0.38, distance: 30, texture: 'textures/mercury.jpg' },
        { name: 'Venus', size: 0.95, distance: 55, texture: 'textures/venus.jpg' },
        { name: 'Earth', size: 1.0, distance: 80, texture: 'textures/earth.jpg' },
        { name: 'Mars', size: 0.53, distance: 110, texture: 'textures/mars.jpg' },
        { name: 'Jupiter', size: 11.2, distance: 250, texture: 'textures/jupiter.jpg' },
        { name: 'Saturn', size: 9.45, distance: 350, texture: 'textures/saturn.jpg', ringInnerRadius: 11, ringOuterRadius: 20, ringTexture: 'textures/saturn_ring.png' },
        { name: 'Uranus', size: 4.0, distance: 450, texture: 'textures/uranus.jpg' },
        { name: 'Neptune', size: 3.88, distance: 550, texture: 'textures/neptune.jpg' }
    ];

    const planets = [];
    planetsData.forEach(data => {
        const planetGeometry = new THREE.SphereGeometry(data.size * 5, 32, 32); // Scale up for visibility
        const planetMaterial = new THREE.MeshPhongMaterial({ map: textureLoader.load(data.texture) });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.position.x = data.distance;
        solarSystemGroup.add(planet);
        planets.push(planet);

        // Add Saturn's ring
        if (data.name === 'Saturn') {
            const ringGeometry = new THREE.RingGeometry(data.ringInnerRadius * 5, data.ringOuterRadius * 5, 64); // Scale rings too
            const ringMaterial = new THREE.MeshBasicMaterial({
                map: textureLoader.load(data.ringTexture),
                side: THREE.DoubleSide,
                transparent: true
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2; // Rotate to be horizontal
            ring.position.copy(planet.position);
            solarSystemGroup.add(ring);
        }
    });

    // Asteroid Belt
    const asteroidCount = 5000;
    const asteroidVertices = [];
    const asteroidMinDistance = 150;
    const asteroidMaxDistance = 200;
    for (let i = 0; i < asteroidCount; i++) {
        const distance = asteroidMinDistance + Math.random() * (asteroidMaxDistance - asteroidMinDistance);
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * distance + (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 5;
        const z = Math.sin(angle) * distance + (Math.random() - 0.5) * 10;
        asteroidVertices.push(x, y, z);
    }
    const asteroidGeometry = new THREE.BufferGeometry();
    asteroidGeometry.setAttribute('position', new THREE.Float32BufferAttribute(asteroidVertices, 3));
    const asteroidMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.8 });
    const asteroids = new THREE.Points(asteroidGeometry, asteroidMaterial);
    solarSystemGroup.add(asteroids);

    // Kuiper Belt
    const kuiperCount = 10000;
    const kuiperVertices = [];
    const kuiperMinDistance = 600;
    const kuiperMaxDistance = 800;
    for (let i = 0; i < kuiperCount; i++) {
        const distance = kuiperMinDistance + Math.random() * (kuiperMaxDistance - kuiperMinDistance);
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * distance + (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 10;
        const z = Math.sin(angle) * distance + (Math.random() - 0.5) * 20;
        kuiperVertices.push(x, y, z);
    }
    const kuiperGeometry = new THREE.BufferGeometry();
    kuiperGeometry.setAttribute('position', new THREE.Float32BufferAttribute(kuiperVertices, 3));
    const kuiperMaterial = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 1 });
    const kuiperBelt = new THREE.Points(kuiperGeometry, kuiperMaterial);
    solarSystemGroup.add(kuiperBelt);

    // Oort Cloud
    const oortCount = 20000;
    const oortVertices = [];
    const oortMinDistance = 1000;
    const oortMaxDistance = 2000;
    for (let i = 0; i < oortCount; i++) {
        const distance = oortMinDistance + Math.random() * (oortMaxDistance - oortMinDistance);
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const x = distance * Math.sin(theta) * Math.cos(phi);
        const y = distance * Math.sin(theta) * Math.sin(phi);
        const z = distance * Math.cos(theta);
        oortVertices.push(x, y, z);
    }
    const oortGeometry = new THREE.BufferGeometry();
    oortGeometry.setAttribute('position', new THREE.Float32BufferAttribute(oortVertices, 3));
    const oortMaterial = new THREE.PointsMaterial({ color: 0xdddddd, size: 1.2 });
    const oortCloud = new THREE.Points(oortGeometry, oortMaterial);
    solarSystemGroup.add(oortCloud);

    // --- Animation Loop ---
    const cameraSpeed = 0.2; // Slower camera movement
    const cameraPath = [
        { z: 200, target: new THREE.Vector3(0, 0, 0) }, // Start near Sun
        { z: -100, target: planets[0].position }, // Mercury
        { z: -200, target: planets[1].position }, // Venus
        { z: -300, target: planets[2].position }, // Earth
        { z: -400, target: planets[3].position }, // Mars
        { z: -550, target: asteroids.position }, // Asteroid Belt
        { z: -700, target: planets[4].position }, // Jupiter
        { z: -850, target: planets[5].position }, // Saturn
        { z: -1000, target: planets[6].position }, // Uranus
        { z: -1150, target: planets[7].position }, // Neptune
        { z: -1500, target: kuiperBelt.position }, // Kuiper Belt
        { z: -2500, target: oortCloud.position }, // Oort Cloud
        { z: -4000, target: new THREE.Vector3(0, 0, -5000) } // Interstellar space
    ];
    let currentPathIndex = 0;

    function animate() {
        requestAnimationFrame(animate);

        controls.update(); // Required for damping and interactivity

        // Camera movement along path
        if (currentPathIndex < cameraPath.length) {
            const targetZ = cameraPath[currentPathIndex].z;
            const targetPosition = cameraPath[currentPathIndex].target;

            // Move camera towards target Z
            if (Math.abs(camera.position.z - targetZ) > cameraSpeed) {
                camera.position.z += (targetZ - camera.position.z) * 0.01; // Smooth interpolation
            } else {
                camera.position.z = targetZ; // Snap to target if very close
            }

            // Smoothly move camera towards target object's X and Y
            camera.position.x += (targetPosition.x - camera.position.x) * 0.005;
            camera.position.y += (targetPosition.y - camera.position.y) * 0.005;

            // Advance to next target when close enough to Z target
            if (Math.abs(camera.position.z - targetZ) < 5 && Math.abs(camera.position.x - targetPosition.x) < 5 && Math.abs(camera.position.y - targetPosition.y) < 5) {
                currentPathIndex++;
            }
        } else {
            // Continue into deep space or loop back
            camera.position.z -= cameraSpeed;
            if (camera.position.z < -5000) { // Reset after deep space
                camera.position.set(0, 0, 200);
                currentPathIndex = 0;
            }
        }

        // Animate planets (simple rotation for now)
        planets.forEach(planet => {
            planet.rotation.y += 0.005;
        });

        // Animate stars (move forward relative to camera)
        let positions = starGeometry.attributes.position.array;
        for (let i = 2; i < positions.length; i += 3) {
            positions[i] += 0.5; // Move z forward
            if (positions[i] > camera.position.z + 2000) { // If star passes camera, reset it far behind
                positions[i] = camera.position.z - 4000;
                positions[i - 2] = (Math.random() - 0.5) * 8000;
                positions[i - 1] = (Math.random() - 0.5) * 8000;
            }
        }
        starGeometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }
    animate();
});
