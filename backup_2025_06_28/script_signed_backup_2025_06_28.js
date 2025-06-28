/*
==============================================================================
                    JAVASCRIPT FOR SOCIAL MEDIA WEBSITE
                    Copyright © 2025 Amir Shirkhodaee
==============================================================================

AUTHOR: Amir Shirkhodaee
DATE: June 28, 2025
VERSION: v1.0
GITHUB: https://github.com/Amsh23
EMAIL: amirshirkhodaeetari@gmail.com

FEATURES:
- Social links animations
- Smooth scrolling
- 3D character viewer integration
- Interactive elements
- Mobile responsive functionality

DIGITAL SIGNATURE: AmirShirkhodaee-SocialMediaJS-v1.0-2025
CHECKSUM: D5E9F2A4B7C31X98

WARNING: Unauthorized modification is prohibited
Copyright © 2025 Amir Shirkhodaee - All Rights Reserved

==============================================================================
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
    
    // Initialize 3D Character Viewer
    if (document.getElementById('character-viewer')) {
        console.log('Initializing 3D Character Viewer...');
        
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.error('Three.js is not loaded');
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.innerHTML = '<p style="color: #ff6b6b;">Failed to load Three.js library</p>';
            }
            return;
        }
        
        // Check if required Three.js components are available
        if (typeof THREE.GLTFLoader === 'undefined') {
            console.error('GLTFLoader is not available');
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.innerHTML = '<p style="color: #ff6b6b;">GLTFLoader not available</p>';
            }
            return;
        }
        
        if (typeof THREE.OrbitControls === 'undefined') {
            console.error('OrbitControls is not available');
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.innerHTML = '<p style="color: #ff6b6b;">OrbitControls not available</p>';
            }
            return;
        }
        
        try {
            new ThreeCharacterViewer();
        } catch (error) {
            console.error('Failed to initialize 3D Character Viewer:', error);
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.innerHTML = '<p style="color: #ff6b6b;">Failed to initialize 3D viewer: ' + error.message + '</p>';
            }
        }
    }
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
}

// 3D Character Viewer Implementation
class ThreeCharacterViewer {
    constructor() {
        console.log('ThreeCharacterViewer constructor called');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.character = null;
        this.mixer = null;
        this.animations = {};
        this.currentAction = null;
        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.isLoaded = false;
        
        try {
            this.init();
        } catch (error) {
            console.error('Error in ThreeCharacterViewer init:', error);
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.innerHTML = '<p style="color: #ff6b6b;">Initialization error: ' + error.message + '</p>';
            }
        }
    }
    
    init() {
        console.log('Initializing 3D scene...');
        const container = document.getElementById('three-container');
        const canvas = document.getElementById('three-canvas');
        const loadingIndicator = document.getElementById('loading-indicator');
        
        if (!container || !canvas) {
            console.error('Required HTML elements not found');
            if (loadingIndicator) {
                loadingIndicator.innerHTML = '<p style="color: #ff6b6b;">Required HTML elements not found</p>';
            }
            return;
        }
        
        console.log('HTML elements found, creating scene...');
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.5, 3);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true 
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
        // Lighting setup
        this.setupLighting();
        
        // Ground plane
        this.createGround();
        
        // Controls setup
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 10;
        this.controls.maxPolarAngle = Math.PI / 2;
        
        // Load character model
        this.loadCharacter().then(() => {
            loadingIndicator.style.display = 'none';
            this.isLoaded = true;
        }).catch(error => {
            console.error('Failed to load character:', error);
            loadingIndicator.innerHTML = '<p style="color: #ff6b6b;">Failed to load 3D character. Please check if the model file exists.</p>';
        });
        
        // Event listeners
        this.setupEventListeners();
        
        // Animation loop
        this.animate();
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);
        
        // Point light for character illumination
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 10);
        pointLight.position.set(0, 3, 2);
        this.scene.add(pointLight);
    }
    
    createGround() {
        const geometry = new THREE.PlaneGeometry(20, 20);
        const material = new THREE.MeshLambertMaterial({ 
            color: 0x90EE90,
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }
    
    async loadCharacter() {
        const loader = new THREE.GLTFLoader();
        
        return new Promise((resolve, reject) => {
            // Try to load the model from different possible paths
            const modelPaths = [
                './6_12_2025_final8_47pm.temp6273718148.glb',
                './public/model.glb',
                './model.glb',
                './6_12_2025    final8_47pm.temp6273718148.glb'
            ];
            
            let loadAttempt = 0;
            
            const tryLoadModel = (path) => {
                loader.load(
                    path,
                    (gltf) => {
                        this.character = gltf.scene;
                        this.character.scale.set(1, 1, 1);
                        this.character.position.set(0, 0, 0);
                        this.character.castShadow = true;
                        this.character.receiveShadow = true;
                        
                        // Enable shadows for all meshes
                        this.character.traverse((child) => {
                            if (child.isMesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                            }
                        });
                        
                        this.scene.add(this.character);
                        
                        // Setup animations
                        if (gltf.animations && gltf.animations.length > 0) {
                            this.mixer = new THREE.AnimationMixer(this.character);
                            
                            gltf.animations.forEach((animation, index) => {
                                const action = this.mixer.clipAction(animation);
                                this.animations[animation.name || `animation_${index}`] = action;
                            });
                            
                            // Play first animation as idle
                            const firstAnimation = Object.values(this.animations)[0];
                            if (firstAnimation) {
                                firstAnimation.play();
                                this.currentAction = firstAnimation;
                            }
                        }
                        
                        resolve();
                    },
                    (progress) => {
                        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
                    },
                    (error) => {
                        loadAttempt++;
                        if (loadAttempt < modelPaths.length) {
                            console.log(`Failed to load ${path}, trying next path...`);
                            tryLoadModel(modelPaths[loadAttempt]);
                        } else {
                            console.error('Failed to load model from all paths:', error);
                            reject(error);
                        }
                    }
                );
            };
            
            tryLoadModel(modelPaths[0]);
        });
    }
    
    setupEventListeners() {
        // Mouse tracking for character head movement
        window.addEventListener('mousemove', (event) => {
            if (!this.isLoaded || !this.character) return;
            
            const container = document.getElementById('three-container');
            const rect = container.getBoundingClientRect();
            
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            this.updateCharacterLook();
        });
        
        // Click detection for special animation
        window.addEventListener('click', (event) => {
            if (!this.isLoaded || !this.character) return;
            
            const container = document.getElementById('three-container');
            const rect = container.getBoundingClientRect();
            
            if (event.clientX >= rect.left && event.clientX <= rect.right &&
                event.clientY >= rect.top && event.clientY <= rect.bottom) {
                
                this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                
                this.raycaster.setFromCamera(this.mouse, this.camera);
                const intersects = this.raycaster.intersectObject(this.character, true);
                
                if (intersects.length > 0) {
                    this.playSpecialAnimation();
                }
            }
        });
        
        // Animation control buttons
        document.getElementById('idle-btn')?.addEventListener('click', () => this.playAnimation('idle'));
        document.getElementById('dance-btn')?.addEventListener('click', () => this.playAnimation('dance'));
        document.getElementById('wave-btn')?.addEventListener('click', () => this.playAnimation('wave'));
        document.getElementById('special-btn')?.addEventListener('click', () => this.playSpecialAnimation());
        
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    updateCharacterLook() {
        if (!this.character) return;
        
        // Find head bone or create a simple look-at behavior
        const headBone = this.character.getObjectByName('Head') || 
                         this.character.getObjectByName('head') ||
                         this.character.getObjectByName('Head_End');
        
        if (headBone) {
            const targetPosition = new THREE.Vector3(
                this.mouse.x * 2,
                this.mouse.y * 2 + 1.5,
                2
            );
            headBone.lookAt(targetPosition);
        } else {
            // Fallback: rotate entire character slightly
            if (this.character) {
                this.character.rotation.y = this.mouse.x * 0.1;
            }
        }
    }
    
    playAnimation(animationName) {
        if (!this.mixer || !this.animations) return;
        
        // Map button names to possible animation names
        const animationMap = {
            'idle': ['Idle', 'idle', 'T-Pose', 'Rest', 'Stand'],
            'dance': ['Dance', 'dance', 'Dancing', 'Move', 'Groove'],
            'wave': ['Wave', 'wave', 'Waving', 'Hello', 'Greeting'],
            'special': ['Jump', 'jump', 'Excited', 'Happy', 'Celebrate']
        };
        
        const possibleNames = animationMap[animationName] || [animationName];
        let targetAction = null;
        
        // Find the animation
        for (const name of possibleNames) {
            if (this.animations[name]) {
                targetAction = this.animations[name];
                break;
            }
        }
        
        // If no specific animation found, use first available
        if (!targetAction && Object.keys(this.animations).length > 0) {
            targetAction = Object.values(this.animations)[0];
        }
        
        if (targetAction && targetAction !== this.currentAction) {
            // Smooth transition between animations
            if (this.currentAction) {
                this.currentAction.fadeOut(0.3);
            }
            
            targetAction.reset().fadeIn(0.3).play();
            this.currentAction = targetAction;
            
            // Update button states
            document.querySelectorAll('.anim-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(`${animationName}-btn`)?.classList.add('active');
        }
    }
    
    playSpecialAnimation() {
        this.playAnimation('special');
        
        // Add visual feedback
        const specialBtn = document.getElementById('special-btn');
        if (specialBtn) {
            specialBtn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                specialBtn.style.transform = '';
            }, 200);
        }
    }
    
    onWindowResize() {
        const container = document.getElementById('three-container');
        if (!container) return;
        
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        if (this.controls) {
            this.controls.update();
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

/*
==============================================================================
End of JavaScript Module - Copyright © 2025 Amir Shirkhodaee
GitHub: https://github.com/Amsh23 | Email: amirshirkhodaeetari@gmail.com
DIGITAL SIGNATURE: AmirShirkhodaee-SocialMediaJS-v1.0-2025
==============================================================================
*/