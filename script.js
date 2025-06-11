// Add animation to social links
document.addEventListener('DOMContentLoaded', function() {
    const socialLinks = document.querySelectorAll('.social-link');
    
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
    
    // Gallery Modal Functionality
    const galleryIcon = document.getElementById('open-gallery');
    const galleryModal = document.getElementById('gallery-modal');
    const galleryCloseBtn = galleryModal.querySelector('.close-modal');
    
    galleryIcon.addEventListener('click', () => {
        galleryModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    galleryCloseBtn.addEventListener('click', () => {
        galleryModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Video Modal Functionality
    const videoIcon = document.getElementById('open-video');
    const videoModal = document.getElementById('video-modal');
    const videoCloseBtn = videoModal.querySelector('.close-modal');
    
    videoIcon.addEventListener('click', () => {
        videoModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    videoCloseBtn.addEventListener('click', () => {
        videoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Pause video when closing modal
        const videoPlayer = videoModal.querySelector('video');
        if (videoPlayer) {
            videoPlayer.pause();
        }
    });
    
    // Anime Modal Functionality
    const animeIcon = document.getElementById('open-anime');
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
    
    // Movies Modal Functionality
    const moviesIcon = document.getElementById('open-movies');
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
    
    // Close modals when clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Pause video when closing modal
            const videoPlayer = videoModal.querySelector('video');
            if (videoPlayer) {
                videoPlayer.pause();
            }
        }
        if (e.target === animeModal) {
            animeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === moviesModal) {
            moviesModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modals on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (galleryModal.style.display === 'block') {
                galleryModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
            if (videoModal.style.display === 'block') {
                videoModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                
                // Pause video when closing modal
                const videoPlayer = videoModal.querySelector('video');
                if (videoPlayer) {
                    videoPlayer.pause();
                }
            }
            if (animeModal.style.display === 'block') {
                animeModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
            if (moviesModal.style.display === 'block') {
                moviesModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });
    
    // Gallery functionality with load more
    const galleryImages = document.querySelectorAll('.gallery-img');
    const loadMoreBtn = document.getElementById('load-more');
    const imagesPerPage = 12;
    let currentImages = imagesPerPage;
    
    // Initially hide images beyond the first batch
    galleryImages.forEach((img, index) => {
        if (index >= imagesPerPage) {
            img.style.display = 'none';
        }
    });
    
    // Load more images when button is clicked
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
        for (let i = currentImages; i < currentImages + imagesPerPage && i < galleryImages.length; i++) {
            galleryImages[i].style.display = 'block';
            
            // Add fade-in animation
            galleryImages[i].style.opacity = '0';
            setTimeout(() => {
                galleryImages[i].style.transition = 'opacity 0.5s ease';
                galleryImages[i].style.opacity = '1';
            }, 50 * (i - currentImages));
        }
        
        currentImages += imagesPerPage;
        
        // Hide the load more button if all images are displayed
        if (currentImages >= galleryImages.length) {
            loadMoreBtn.style.display = 'none';
        }
        });
    }
    
    // Gallery lightbox functionality
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.display = 'none';
    
    const lightboxImg = document.createElement('img');
    lightboxImg.className = 'lightbox-img';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    
    lightbox.appendChild(lightboxImg);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
    
    // Add click event to gallery images
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox when clicking close button or outside the image
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Close lightbox on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });
});
    
