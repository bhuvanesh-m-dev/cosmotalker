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
