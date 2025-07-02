/*
==============================================================================
                    TELEGRAM MESSAGE FORM HANDLER
                    Copyright © 2025 Amir Shirkhodaee
==============================================================================

AUTHOR: Amir Shirkhodaee
DATE: July 2, 2025
VERSION: v1.0
GITHUB: https://github.com/Amsh23
EMAIL: amirshirkhodaeetari@gmail.com

FEATURES:
- Secure message sending to Telegram Bot API via relay server
- Input validation and character counting
- Loading states and error handling
- Responsive form interactions
- No bot token exposure to frontend

DIGITAL SIGNATURE: AmirShirkhodaee-TelegramForm-v1.0-2025

WARNING: Update API_URL with your deployed server URL
Copyright © 2025 Amir Shirkhodaee - All Rights Reserved

==============================================================================
*/

class TelegramMessageForm {
    constructor() {
        // ⚠️ IMPORTANT: Replace this with your deployed server URL
        this.API_URL = 'https://your-railway-server.railway.app/send';
        
        // DOM elements
        this.form = document.getElementById('telegram-message-form');
        this.messageInput = document.getElementById('telegram-message-input');
        this.sendBtn = document.getElementById('send-btn');
        this.charCount = document.getElementById('char-count');
        this.successMessage = document.getElementById('success-message');
        this.errorMessage = document.getElementById('error-message');
        
        // Initialize if elements exist
        if (this.form && this.messageInput && this.sendBtn) {
            this.init();
        }
    }
    
    init() {
        console.log('🤖 Telegram Message Form initialized');
        
        // Event listeners
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.messageInput.addEventListener('input', () => this.updateCharCount());
        this.messageInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Initial character count update
        this.updateCharCount();
        
        // Check if API URL needs to be configured
        if (this.API_URL.includes('your-railway-server')) {
            console.warn('⚠️ Please update API_URL in telegram-form.js with your deployed server URL');
        }
    }
    
    // Update character counter
    updateCharCount() {
        const currentLength = this.messageInput.value.length;
        this.charCount.textContent = currentLength;
        
        // Change color based on character count
        if (currentLength > 450) {
            this.charCount.style.color = '#e74c3c';
        } else if (currentLength > 400) {
            this.charCount.style.color = '#f39c12';
        } else {
            this.charCount.style.color = '#888';
        }
    }
    
    // Handle keyboard shortcuts
    handleKeydown(e) {
        // Ctrl/Cmd + Enter to send message
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Handle form submission
    async handleSubmit(e) {
        e.preventDefault();
        
        const message = this.messageInput.value.trim();
        
        // Validate message
        if (!message) {
            this.showError('Please enter a message before sending.');
            this.messageInput.focus();
            return;
        }
        
        if (message.length > 500) {
            this.showError('Message is too long. Please keep it under 500 characters.');
            return;
        }
        
        // Send message
        await this.sendMessage(message);
    }
    
    // Send message to Telegram via relay server
    async sendMessage(message) {
        // Show loading state
        this.setLoadingState(true);
        this.hideMessages();
        
        try {
            console.log('📤 Sending message to Telegram...');
            
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Success
                console.log('✅ Message sent successfully');
                this.showSuccess('Message sent successfully! I\'ll get back to you soon.');
                this.messageInput.value = '';
                this.updateCharCount();
                
                // Add success animation
                this.addSuccessAnimation();
            } else {
                // Server returned error
                console.error('❌ Server error:', result.error);
                this.showError(result.error || 'Failed to send message. Please try again.');
            }
            
        } catch (error) {
            // Network or other error
            console.error('❌ Network error:', error);
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                this.showError('Unable to connect to server. Please check your internet connection.');
            } else {
                this.showError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            // Hide loading state
            this.setLoadingState(false);
        }
    }
    
    // Show loading state on send button
    setLoadingState(loading) {
        if (loading) {
            this.sendBtn.classList.add('loading');
            this.sendBtn.disabled = true;
            this.sendBtn.innerHTML = '<i class="fab fa-telegram-plane"></i> Sending...';
        } else {
            this.sendBtn.classList.remove('loading');
            this.sendBtn.disabled = false;
            this.sendBtn.innerHTML = '<i class="fab fa-telegram-plane"></i> Send to Telegram';
        }
    }
    
    // Show success message
    showSuccess(message) {
        this.successMessage.textContent = message;
        this.successMessage.classList.remove('hidden');
        this.errorMessage.classList.add('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.successMessage.classList.add('hidden');
        }, 5000);
    }
    
    // Show error message
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
        this.successMessage.classList.add('hidden');
        
        // Auto-hide after 7 seconds
        setTimeout(() => {
            this.errorMessage.classList.add('hidden');
        }, 7000);
    }
    
    // Hide all status messages
    hideMessages() {
        this.successMessage.classList.add('hidden');
        this.errorMessage.classList.add('hidden');
    }
    
    // Add success animation to form
    addSuccessAnimation() {
        this.form.style.transform = 'scale(0.98)';
        this.form.style.transition = 'transform 0.15s ease';
        
        setTimeout(() => {
            this.form.style.transform = 'scale(1)';
        }, 150);
        
        setTimeout(() => {
            this.form.style.transition = '';
        }, 300);
    }
    
    // Public method to update API URL (for easy configuration)
    setApiUrl(url) {
        this.API_URL = url;
        console.log('🔧 API URL updated to:', url);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance for easy access
    window.telegramForm = new TelegramMessageForm();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // Wait for DOMContentLoaded
} else {
    // DOM is already ready
    window.telegramForm = new TelegramMessageForm();
}

/*
==============================================================================
End of Telegram Message Form Handler - Copyright © 2025 Amir Shirkhodaee
GitHub: https://github.com/Amsh23 | Email: amirshirkhodaeetari@gmail.com
DIGITAL SIGNATURE: AmirShirkhodaee-TelegramForm-v1.0-2025

Usage Example:
// To update API URL after deployment:
// window.telegramForm.setApiUrl('https://your-deployed-server.com/send');

==============================================================================
*/
