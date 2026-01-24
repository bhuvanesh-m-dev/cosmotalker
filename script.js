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
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
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
window.addEventListener('DOMContentLoaded', () => {
    initGlobe();
    initScrollReveal();
});
