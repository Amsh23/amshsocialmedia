/*
==============================================================================
                    3D CHARACTER VIEWER MODULE
                    Copyright © 2025 Amir Shirkhodaee
==============================================================================

AUTHOR: Amir Shirkhodaee
DATE: June 28, 2025
VERSION: v1.0
GITHUB: https://github.com/Amsh23
EMAIL: amirshirkhodaeetari@gmail.com

FEATURES:
- Three.js 3D character rendering
- Animation system (Idle, Wave, Dance, Special)
- Mouse tracking for Special mode
- Responsive canvas resizing
- Independent module design

DIGITAL SIGNATURE: AmirShirkhodaee-3DCharacterViewer-v1.0-2025
CHECKSUM: F7A3E8B1C9D42X55

WARNING: Unauthorized modification is prohibited
Copyright © 2025 Amir Shirkhodaee - All Rights Reserved

==============================================================================*/

// 3D Character Animation Module - Independent from existing site code
class CharacterViewer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.character = null;
        this.currentAnimation = 'idle';
        this.animationTime = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotation = { x: 0, y: 0, z: 0 };
        this.originalPosition = { x: 0, y: 0, z: 0 };
        this.originalRotation = { x: 0, y: 0, z: 0 };
        
        this.init();
    }
    
    init() {
        const viewerContainer = document.getElementById('viewer');
        if (!viewerContainer) {
            console.warn('3D Viewer container not found. Please add <div id="viewer"></div> to your HTML.');
            return;
        }
        
        this.setupThreeJS(viewerContainer);
        this.loadCharacter();
        this.setupControls();
        this.setupEventListeners();
        this.animate();
    }
    
    setupThreeJS(container) {
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        const containerRect = container.getBoundingClientRect();
        this.camera = new THREE.PerspectiveCamera(
            50,
            containerRect.width / containerRect.height,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.5, 3);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(containerRect.width, containerRect.height);
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        container.appendChild(this.renderer.domElement);
        
        // Basic lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }
    
    loadCharacter() {
        const loader = new THREE.GLTFLoader();
        
        // Try to load the specific model file
        loader.load(
            'vroidcharacter.glb',
            (gltf) => {
                this.character = gltf.scene;
                
                // Center and scale the character
                const box = new THREE.Box3().setFromObject(this.character);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                // Scale to fit in scene
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2 / maxDim;
                this.character.scale.setScalar(scale);
                
                // Center the character
                this.character.position.sub(center.multiplyScalar(scale));
                this.character.position.y = -1; // Place on ground
                
                // Store original position and rotation
                this.originalPosition = {
                    x: this.character.position.x,
                    y: this.character.position.y,
                    z: this.character.position.z
                };
                this.originalRotation = {
                    x: this.character.rotation.x,
                    y: this.character.rotation.y,
                    z: this.character.rotation.z
                };
                
                this.scene.add(this.character);
                
                // Hide loading indicator
                const loading = document.getElementById('loading');
                if (loading) loading.style.display = 'none';
                
                console.log('3D Character loaded successfully');
            },
            (progress) => {
                console.log('Loading progress:', progress);
            },
            (error) => {
                console.error('Error loading 3D character:', error);
                // Hide loading indicator even on error
                const loading = document.getElementById('loading');
                if (loading) loading.style.display = 'none';
            }
        );
    }
    
    setupControls() {
        // Button event listeners
        const buttons = [
            { id: 'idle-btn', animation: 'idle' },
            { id: 'wave-btn', animation: 'wave' },
            { id: 'dance-btn', animation: 'dance' },
            { id: 'special-btn', animation: 'special' }
        ];
        
        buttons.forEach(({ id, animation }) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => {
                    this.setAnimation(animation);
                    this.updateActiveButton(id);
                });
            }
        });
    }
    
    setAnimation(animationType) {
        this.currentAnimation = animationType;
        this.animationTime = 0;
        
        // Reset character to original position/rotation when switching animations
        if (this.character) {
            this.character.position.set(
                this.originalPosition.x,
                this.originalPosition.y,
                this.originalPosition.z
            );
            this.character.rotation.set(
                this.originalRotation.x,
                this.originalRotation.y,
                this.originalRotation.z
            );
        }
    }
    
    updateActiveButton(activeId) {
        const buttons = ['idle-btn', 'wave-btn', 'dance-btn', 'special-btn'];
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.classList.toggle('active', id === activeId);
            }
        });
    }
    
    setupEventListeners() {
        // Mouse tracking for special animation
        const viewerContainer = document.getElementById('viewer');
        if (viewerContainer) {
            viewerContainer.addEventListener('mousemove', (event) => {
                if (this.currentAnimation === 'special') {
                    const rect = viewerContainer.getBoundingClientRect();
                    this.mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                    this.mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                }
            });
        }
        
        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    handleResize() {
        const viewerContainer = document.getElementById('viewer');
        if (!viewerContainer || !this.camera || !this.renderer) return;
        
        const rect = viewerContainer.getBoundingClientRect();
        this.camera.aspect = rect.width / rect.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(rect.width, rect.height);
    }
    
    updateAnimations() {
        if (!this.character) return;
        
        this.animationTime += 0.016; // ~60fps
        
        switch (this.currentAnimation) {
            case 'idle':
                this.animateIdle();
                break;
            case 'wave':
                this.animateWave();
                break;
            case 'dance':
                this.animateDance();
                break;
            case 'special':
                this.animateSpecial();
                break;
        }
    }
    
    animateIdle() {
        // Gentle breathing motion
        const breathe = Math.sin(this.animationTime * 2) * 0.02;
        this.character.position.y = this.originalPosition.y + breathe;
        
        // Subtle sway
        const sway = Math.sin(this.animationTime * 1.5) * 0.05;
        this.character.rotation.z = this.originalRotation.z + sway;
    }
    
    animateWave() {
        // Side-to-side waving motion
        const wave = Math.sin(this.animationTime * 3) * 0.3;
        this.character.rotation.z = this.originalRotation.z + wave;
        
        // Add slight up-down motion
        const bounce = Math.sin(this.animationTime * 6) * 0.05;
        this.character.position.y = this.originalPosition.y + bounce;
    }
    
    animateDance() {
        // Vertical bouncing
        const bounce = Math.abs(Math.sin(this.animationTime * 4)) * 0.2;
        this.character.position.y = this.originalPosition.y + bounce;
        
        // Rotation on multiple axes
        const rotateY = Math.sin(this.animationTime * 2) * 0.5;
        const rotateZ = Math.cos(this.animationTime * 3) * 0.2;
        
        this.character.rotation.y = this.originalRotation.y + rotateY;
        this.character.rotation.z = this.originalRotation.z + rotateZ;
    }
    
    animateSpecial() {
        // Mouse tracking rotation
        const targetRotationY = this.mouseX * Math.PI * 0.3;
        const targetRotationX = this.mouseY * Math.PI * 0.1;
        
        // Smooth interpolation
        this.character.rotation.y += (targetRotationY - this.character.rotation.y) * 0.05;
        this.character.rotation.x += (targetRotationX - this.character.rotation.x) * 0.05;
        
        // Add some gentle floating motion
        const float = Math.sin(this.animationTime * 2) * 0.1;
        this.character.position.y = this.originalPosition.y + float;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.updateAnimations();
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if viewer container exists
    if (document.getElementById('viewer')) {
        new CharacterViewer();
    }
});

// Also try to initialize immediately in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // Wait for DOMContentLoaded
} else {
    // DOM is already ready
    if (document.getElementById('viewer')) {
        new CharacterViewer();
    }
}

/*
==============================================================================
End of 3D Character Viewer Module - Copyright © 2025 Amir Shirkhodaee
GitHub: https://github.com/Amsh23 | Email: amirshirkhodaeetari@gmail.com
DIGITAL SIGNATURE: AmirShirkhodaee-3DCharacterViewer-v1.0-2025
==============================================================================
*/
