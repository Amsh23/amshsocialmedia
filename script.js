// Add animation to social links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize social links animations
    initializeSocialLinks();
    
    // Add smooth scrolling for internal links
    addSmoothScrolling();
    
    // Add a subtle entrance animation to each section
    animateSections();
    
    // Initialize any remaining media modals if they exist
    initializeMediaModals();
});

// Initialize social links animations
function initializeSocialLinks() {
    const socialLinksContainers = document.querySelectorAll('.social-links');
    
    socialLinksContainers.forEach(container => {
        const socialLinks = container.querySelectorAll('.social-link');
        
        socialLinks.forEach((link, index) => {
            // Add staggered animation delay
            link.style.opacity = '0';
            link.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                link.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    });
}

// Add smooth scrolling for internal links
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add a subtle entrance animation to each section
function animateSections() {
    const sections = document.querySelectorAll('.skills-section, .projects-section, .spotify-section, .interests-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });
    
    // Add the CSS class that will be applied when the section is visible
    const style = document.createElement('style');
    style.textContent = `
        .section-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Initialize media modals functionality if they exist
function initializeMediaModals() {
    // Anime Modal Functionality
    const animeIcon = document.getElementById('open-anime');
    if (animeIcon) {
        const animeModal = document.getElementById('anime-modal');
        const animeCloseBtn = animeModal.querySelector('.close-modal');
        
        animeIcon.addEventListener('click', () => {
            animeModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        
        animeCloseBtn.addEventListener('click', () => {
            animeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Close anime modal when clicking outside content
        window.addEventListener('click', (e) => {
            if (e.target === animeModal) {
                animeModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Movies Modal Functionality
    const moviesIcon = document.getElementById('open-movies');
    if (moviesIcon) {
        const moviesModal = document.getElementById('movies-modal');
        const moviesCloseBtn = moviesModal.querySelector('.close-modal');
        
        moviesIcon.addEventListener('click', () => {
            moviesModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        
        moviesCloseBtn.addEventListener('click', () => {
            moviesModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Close movies modal when clicking outside content
        window.addEventListener('click', (e) => {
            if (e.target === moviesModal) {
                moviesModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Close modals on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const animeModal = document.getElementById('anime-modal');
            const moviesModal = document.getElementById('movies-modal');
            
            if (animeModal && animeModal.style.display === 'block') {
                animeModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
            
            if (moviesModal && moviesModal.style.display === 'block') {
                moviesModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });
}// Initialize media modals functionality if they exist
function initializeMediaModals() {
    // Anime Modal Functionality
    const animeIcon = document.getElementById('open-anime');
    if (animeIcon) {
        const animeModal = document.getElementById('anime-modal');
        const animeCloseBtn = animeModal.querySelector('.close-modal');
        
        animeIcon.addEventListener('click', () => {
            animeModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        
        animeCloseBtn.addEventListener('click', () => {
            animeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Close anime modal when clicking outside content
        window.addEventListener('click', (e) => {
            if (e.target === animeModal) {
                animeModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Movies Modal Functionality
    const moviesIcon = document.getElementById('open-movies');
    if (moviesIcon) {
        const moviesModal = document.getElementById('movies-modal');
        const moviesCloseBtn = moviesModal.querySelector('.close-modal');
        
        moviesIcon.addEventListener('click', () => {
            moviesModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        
        moviesCloseBtn.addEventListener('click', () => {
            moviesModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Close movies modal when clicking outside content
        window.addEventListener('click', (e) => {
            if (e.target === moviesModal) {
                moviesModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Close modals on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const animeModal = document.getElementById('anime-modal');
            const moviesModal = document.getElementById('movies-modal');
            
            if (animeModal && animeModal.style.display === 'block') {
                animeModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
            
            if (moviesModal && moviesModal.style.display === 'block') {
                moviesModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });
}
    
