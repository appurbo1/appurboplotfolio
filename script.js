// Navigation toggle for mobile
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

// Smooth scrolling for navigation links
const smoothScroll = () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const nav = document.querySelector('.nav-links');
            if (nav.classList.contains('nav-active')) {
                document.querySelector('.burger').click();
            }
        });
    });
}

// Form submission handling
const handleFormSubmission = () => {
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const subject = this.querySelector('input[placeholder="Subject"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Here you would typically send the form data to a server
            // For now, we'll just show a success message
            alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
            
            // Reset form
            this.reset();
        });
    }
}

// Scroll animation for elements
const scrollAnimation = () => {
    const elements = document.querySelectorAll('.skill-card, .project-card, .about-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize all functions
const app = () => {
    navSlide();
    smoothScroll();
    handleFormSubmission();
    
    // Add scroll animation after page load
    window.addEventListener('load', () => {
        scrollAnimation();
    });

    // Robust image fallback: attach early and fix already-failed loads
    const placeholder = 'https://via.placeholder.com/800x600?text=Image+coming+soon';
    const applyFallback = (img) => {
        if (!img.dataset.fallbackApplied) {
            img.src = placeholder;
            img.dataset.fallbackApplied = 'true';
        }
    };

    // Try alternative extensions before giving up
    const tryAlternativeExt = (img) => {
        const src = img.getAttribute('src') || '';
        const match = src.match(/^(.*)\.(jpg|jpeg|png|webp|svg)$/i);
        const base = match ? match[1] : src;
        const originalExt = match ? match[2].toLowerCase() : '';
        const candidates = ['webp','png','jpeg','jpg']
            .filter(ext => ext !== originalExt)
            .map(ext => `${base}.${ext}`);
        let idx = 0;
        const attemptNext = () => {
            if (idx >= candidates.length) {
                applyFallback(img);
                return;
            }
            const candidate = candidates[idx++];
            const probe = new Image();
            probe.onload = () => {
                img.src = candidate;
            };
            probe.onerror = attemptNext;
            probe.src = candidate;
        };
        attemptNext();
    };

    document.querySelectorAll('img').forEach(img => {
        const handleError = () => {
            if (!img.dataset.swapTried) {
                img.dataset.swapTried = 'true';
                tryAlternativeExt(img);
            } else {
                applyFallback(img);
            }
        };
        // If the image already failed before listeners were attached
        if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
            handleError();
        }
        // Handle future errors
        img.addEventListener('error', handleError);
    });
}

app();