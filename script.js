// Main Three.js Logic
const initGlobe = () => {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Position camera slightly to the right to leave space for text on the left
    camera.position.set(0, 0, 1.8);

    // Light
    const ambientLight = new THREE.AmbientLight(0x666666); // Brighter ambient
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2.0); // Brighter point light
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    // Textures
    const textureLoader = new THREE.TextureLoader();

    // Earth Group
    const earthGroup = new THREE.Group();
    // Tilt the earth
    earthGroup.rotation.z = -23.4 * Math.PI / 180;
    scene.add(earthGroup);

    // Earth
    const earthGeometry = new THREE.SphereGeometry(0.6, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('https://raw.githubusercontent.com/ArjunCodess/earth-globe-threejs/main/texture/earthmap.jpeg'),
        bumpMap: textureLoader.load('https://raw.githubusercontent.com/ArjunCodess/earth-globe-threejs/main/texture/earthbump.jpeg'),
        bumpScale: 0.05,
        specularMap: textureLoader.load('https://raw.githubusercontent.com/ArjunCodess/earth-globe-threejs/main/texture/earthmap.jpeg'),
        specular: new THREE.Color('grey')
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earthMesh);

    // Clouds
    const cloudGeometry = new THREE.SphereGeometry(0.61, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('https://raw.githubusercontent.com/ArjunCodess/earth-globe-threejs/main/texture/earthCloud.png'),
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earthGroup.add(cloudMesh);

    // Moon
    const moonGroup = new THREE.Group();
    scene.add(moonGroup); // Independent group for orbit

    const moonGeometry = new THREE.SphereGeometry(0.16, 64, 64); // ~1/4 size of Earth
    const moonMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('https://raw.githubusercontent.com/bhuvanesh-m-dev/cosmotalker/main/docs/img/moonmap4k.jpg'),
        // Fallback or generic moon texture if specific one fails, but using a standard one is safer. 
        // Using a reliable public URL for now.
        map: textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1024px-FullMoon2010.jpg'),
        // Actually, wikimedia is a flat image, let's use a texture map designed for spheres if possible, or the one from the same github source if available.
        // The one used for Earth was from ArjunCodess. Checking if they have moon.
        // Alternative reliable source: 
        map: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg')
    });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.set(2, 0, 0); // Distance from Earth
    moonGroup.add(moonMesh);

    // Stars (Galaxy Background)
    const starGeometry = new THREE.SphereGeometry(8, 64, 64);
    const starMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load('https://raw.githubusercontent.com/ArjunCodess/earth-globe-threejs/main/texture/galaxy.png'),
        side: THREE.BackSide
    });
    const starMesh = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(starMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Scroll Effect
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Auto rotation
        earthMesh.rotation.y += 0.002;
        cloudMesh.rotation.y += 0.0025;
        cloudMesh.rotation.x += 0.0005;

        // Moon Orbit
        moonGroup.rotation.y += 0.005;
        moonMesh.rotation.y += 0.01; // Moon's own rotation

        // Mouse interaction rotation
        earthGroup.rotation.y += 0.05 * (targetX - earthGroup.rotation.y);
        earthGroup.rotation.x += 0.05 * (targetY - earthGroup.rotation.x);

        // Scroll Parallax - Move camera slightly or rotate stars
        starMesh.rotation.y = scrollY * 0.0002;

        // Optional: Move globe to side on scroll to make room for content
        // if (scrollY > 100) {
        //     camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.05);
        // } else {
        //     camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0.5, 0.05);
        // }

        renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// Scroll Reveal Animation
const initScrollReveal = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
        observer.observe(el);
    });
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure layout is computed, though usually not needed.
    // It helps with some browser renders to not block the main thread immediately.
    setTimeout(() => {
        initGlobe();
        initScrollReveal();
    }, 100);
});
