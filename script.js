// Star background animation
function createStars() {
    const starBg = document.getElementById('star-bg');
    if (!starBg) return;
    const numStars = 100; // Number of stars
    for (let i = 0; i < numStars; i++) {
        let star = document.createElement('div');
        star.className = 'star';
        star.style.width = star.style.height = `${Math.random() * 3 + 1}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        starBg.appendChild(star);
    }
}

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
    createStars();

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
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 2000);
    camera.position.z = 20;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- Stars ---
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starVertices = [];
    for (let i = 0; i < starCount; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = -Math.random() * 2000;
        starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1.2 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // --- UFO (simple disc + dome) ---
    const ufoGroup = new THREE.Group();
    // Disc
    const discGeometry = new THREE.CylinderGeometry(3, 5, 1, 32, 1, false);
    const discMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, shininess: 100 });
    const disc = new THREE.Mesh(discGeometry, discMaterial);
    disc.position.y = 0;
    ufoGroup.add(disc);
    // Dome
    const domeGeometry = new THREE.SphereGeometry(2.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff, transparent: true, opacity: 0.7 });
    const dome = new THREE.Mesh(domeGeometry, domeMaterial);
    dome.position.y = 0.5;
    ufoGroup.add(dome);
    // Lights
    const ufoLight = new THREE.PointLight(0x00ffff, 1, 30);
    ufoLight.position.set(0, 2, 0);
    ufoGroup.add(ufoLight);
    ufoGroup.position.set(0, 0, 0);
    scene.add(ufoGroup);

    // --- Galaxy (spiral) ---
    function createGalaxy() {
        const galaxy = new THREE.Group();
        const arms = 3;
        const pointsPerArm = 200;
        for (let a = 0; a < arms; a++) {
            const armAngle = (a / arms) * Math.PI * 2;
            for (let i = 0; i < pointsPerArm; i++) {
                const t = i / pointsPerArm * 6;
                const r = 10 + i * 0.08;
                const x = Math.cos(armAngle + t) * r + (Math.random() - 0.5) * 1.5;
                const y = (Math.random() - 0.5) * 1.5;
                const z = Math.sin(armAngle + t) * r + (Math.random() - 0.5) * 1.5;
                const starGeo = new THREE.SphereGeometry(0.12, 6, 6);
                const starMat = new THREE.MeshBasicMaterial({ color: 0xffeedd });
                const star = new THREE.Mesh(starGeo, starMat);
                star.position.set(x, y, z);
                galaxy.add(star);
            }
        }
        galaxy.position.set(-30, 20, -200);
        return galaxy;
    }
    scene.add(createGalaxy());

    // --- Nebula (colored foggy sphere) ---
    function createNebula() {
        const nebulaGeometry = new THREE.SphereGeometry(8, 32, 32);
        const nebulaMaterial = new THREE.MeshPhongMaterial({
            color: 0x8844ff,
            transparent: true,
            opacity: 0.18,
            shininess: 80,
            emissive: 0x4422aa,
            emissiveIntensity: 0.7
        });
        const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
        nebula.position.set(40, -10, -300);
        return nebula;
    }
    scene.add(createNebula());

    // --- Black Hole (dark sphere with glow) ---
    function createBlackHole() {
        const group = new THREE.Group();
        // Core
        const coreGeometry = new THREE.SphereGeometry(3, 32, 32);
        const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        group.add(core);
        // Glow (accretion disk)
        const diskGeometry = new THREE.TorusGeometry(5, 0.7, 16, 100);
        const diskMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.5 });
        const disk = new THREE.Mesh(diskGeometry, diskMaterial);
        disk.rotation.x = Math.PI / 2;
        group.add(disk);
        group.position.set(0, -30, -400);
        return group;
    }
    scene.add(createBlackHole());

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // --- Animation Loop ---
    let ufoAngle = 0;
    function animate() {
        requestAnimationFrame(animate);
        // Move camera forward
        camera.position.z -= 0.5;
        if (camera.position.z < -1000) camera.position.z = 20;
        // UFO movement
        ufoAngle += 0.01;
        ufoGroup.position.x = Math.sin(ufoAngle) * 10;
        ufoGroup.position.y = Math.cos(ufoAngle) * 2;
        ufoGroup.rotation.y += 0.01;
        // Animate stars (move forward)
        let positions = starGeometry.attributes.position.array;
        for (let i = 2; i < positions.length; i += 3) {
            positions[i] += 2.5; // Move z forward
            if (positions[i] > camera.position.z) {
                positions[i] = -2000;
                positions[i - 2] = (Math.random() - 0.5) * 2000;
                positions[i - 1] = (Math.random() - 0.5) * 2000;
            }
        }
        starGeometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
    }
    animate();
});
