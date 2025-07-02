/*
==============================================================================
                    VISITOR TRACKING SYSTEM
                    Copyright © 2025 Amir Shirkhodaee
==============================================================================

AUTHOR: Amir Shirkhodaee
DATE: July 2, 2025
VERSION: v1.0

FEATURES:
- Complete visitor information collection
- IP address and geolocation tracking
- Browser and device information
- Real-time visitor notifications to Telegram
- Local and remote logging capabilities

DIGITAL SIGNATURE: AmirShirkhodaee-VisitorTracker-v1.0-2025

==============================================================================
*/

class VisitorTracker {
    constructor() {
        this.BOT_TOKEN = '7563475603:AAH-bhTQky3DLzTAdA-V3MzzbU2p9zRx6eM';
        this.CHAT_ID = null; // Will be auto-detected like the form
        this.API_URL = `https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`;
        this.GET_UPDATES_URL = `https://api.telegram.org/bot${this.BOT_TOKEN}/getUpdates`;
        
        this.visitorData = {};
        this.logData = [];
        
        this.init();
    }
    
    async init() {
        console.log('👁️ Visitor Tracking System initialized');
        
        // Get Chat ID first
        await this.getChatId();
        
        // Collect visitor information
        await this.collectVisitorInfo();
        
        // Send to Telegram if Chat ID is available
        if (this.CHAT_ID) {
            await this.sendVisitorNotification();
        }
        
        // Log locally
        this.logVisitorData();
        
        // Track page visibility changes
        this.trackPageActivity();
    }
    
    async getChatId() {
        try {
            // Try localStorage first
            const storedChatId = localStorage.getItem('telegram_chat_id');
            if (storedChatId) {
                this.CHAT_ID = storedChatId;
                return;
            }
            
            // Try to get from bot updates
            const response = await fetch(this.GET_UPDATES_URL);
            const data = await response.json();
            
            if (data.ok && data.result && data.result.length > 0) {
                const lastUpdate = data.result[data.result.length - 1];
                if (lastUpdate.message && lastUpdate.message.chat) {
                    this.CHAT_ID = lastUpdate.message.chat.id.toString();
                    localStorage.setItem('telegram_chat_id', this.CHAT_ID);
                }
            }
        } catch (error) {
            console.warn('⚠️ Could not get Chat ID for visitor tracking:', error);
        }
    }
    
    async collectVisitorInfo() {
        try {
            // Basic browser info
            this.visitorData.timestamp = new Date().toISOString();
            this.visitorData.url = window.location.href;
            this.visitorData.referrer = document.referrer || 'Direct';
            this.visitorData.userAgent = navigator.userAgent;
            this.visitorData.language = navigator.language || navigator.languages[0];
            this.visitorData.platform = navigator.platform;
            this.visitorData.cookieEnabled = navigator.cookieEnabled;
            this.visitorData.screenResolution = `${screen.width}x${screen.height}`;
            this.visitorData.viewportSize = `${window.innerWidth}x${window.innerHeight}`;
            this.visitorData.colorDepth = screen.colorDepth;
            this.visitorData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            // Get IP and location info
            await this.getLocationInfo();
            
            // Browser detection
            this.detectBrowser();
            
            // Device detection
            this.detectDevice();
            
            console.log('📊 Visitor data collected:', this.visitorData);
            
        } catch (error) {
            console.error('❌ Error collecting visitor info:', error);
        }
    }
    
    async getLocationInfo() {
        try {
            // Using multiple IP services for reliability
            const ipServices = [
                'https://api.ipify.org?format=json',
                'https://ipapi.co/json/',
                'https://ipinfo.io/json'
            ];
            
            for (const service of ipServices) {
                try {
                    const response = await fetch(service);
                    const data = await response.json();
                    
                    if (data.ip || data.query) {
                        this.visitorData.ip = data.ip || data.query;
                        this.visitorData.country = data.country || data.country_name;
                        this.visitorData.region = data.region || data.regionName;
                        this.visitorData.city = data.city;
                        this.visitorData.postal = data.postal || data.zip;
                        this.visitorData.latitude = data.latitude || data.lat;
                        this.visitorData.longitude = data.longitude || data.lon;
                        this.visitorData.isp = data.isp || data.org;
                        this.visitorData.timezone_api = data.timezone;
                        break;
                    }
                } catch (serviceError) {
                    console.warn(`⚠️ IP service ${service} failed, trying next...`);
                    continue;
                }
            }
            
            // Fallback to basic geolocation if available
            if (!this.visitorData.latitude && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.visitorData.latitude = position.coords.latitude;
                        this.visitorData.longitude = position.coords.longitude;
                        this.visitorData.accuracy = position.coords.accuracy;
                    },
                    (error) => console.warn('⚠️ Geolocation denied or failed')
                );
            }
            
        } catch (error) {
            console.warn('⚠️ Could not get location info:', error);
            this.visitorData.ip = 'Unknown';
            this.visitorData.country = 'Unknown';
        }
    }
    
    detectBrowser() {
        const ua = navigator.userAgent;
        
        if (ua.includes('Chrome') && !ua.includes('Edg')) {
            this.visitorData.browser = 'Chrome';
        } else if (ua.includes('Firefox')) {
            this.visitorData.browser = 'Firefox';
        } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
            this.visitorData.browser = 'Safari';
        } else if (ua.includes('Edg')) {
            this.visitorData.browser = 'Edge';
        } else if (ua.includes('Opera') || ua.includes('OPR')) {
            this.visitorData.browser = 'Opera';
        } else {
            this.visitorData.browser = 'Unknown';
        }
        
        // Extract version
        const versionMatch = ua.match(new RegExp(this.visitorData.browser + '/([0-9.]+)'));
        this.visitorData.browserVersion = versionMatch ? versionMatch[1] : 'Unknown';
    }
    
    detectDevice() {
        const ua = navigator.userAgent;
        
        if (/Android/i.test(ua)) {
            this.visitorData.device = 'Android';
        } else if (/iPhone|iPad|iPod/i.test(ua)) {
            this.visitorData.device = 'iOS';
        } else if (/Windows/i.test(ua)) {
            this.visitorData.device = 'Windows';
        } else if (/Mac/i.test(ua)) {
            this.visitorData.device = 'Mac';
        } else if (/Linux/i.test(ua)) {
            this.visitorData.device = 'Linux';
        } else {
            this.visitorData.device = 'Unknown';
        }
        
        // Check if mobile
        this.visitorData.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    }
    
    async sendVisitorNotification() {
        try {
            const message = this.formatTelegramMessage();
            
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: this.CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            if (response.ok) {
                console.log('✅ Visitor notification sent to Telegram');
            }
            
        } catch (error) {
            console.warn('⚠️ Could not send visitor notification:', error);
        }
    }
    
    formatTelegramMessage() {
        const data = this.visitorData;
        const flag = this.getCountryFlag(data.country);
        
        return `
🌐 <b>New Website Visitor</b> ${flag}

📍 <b>Location Info:</b>
• IP: <code>${data.ip || 'Unknown'}</code>
• Country: ${data.country || 'Unknown'}
• City: ${data.city || 'Unknown'}
• ISP: ${data.isp || 'Unknown'}

💻 <b>Device Info:</b>
• Browser: ${data.browser} ${data.browserVersion}
• Device: ${data.device} ${data.isMobile ? '📱 Mobile' : '🖥️ Desktop'}
• Screen: ${data.screenResolution}
• Platform: ${data.platform}

🌍 <b>Session Info:</b>
• URL: ${data.url}
• Referrer: ${data.referrer}
• Language: ${data.language}
• Timezone: ${data.timezone}
• Time: ${new Date(data.timestamp).toLocaleString()}

${data.latitude && data.longitude ? `📍 <b>Coordinates:</b> ${data.latitude}, ${data.longitude}` : ''}
        `.trim();
    }
    
    getCountryFlag(country) {
        const flags = {
            'Iran': '🇮🇷', 'US': '🇺🇸', 'United States': '🇺🇸',
            'Germany': '🇩🇪', 'France': '🇫🇷', 'UK': '🇬🇧',
            'Canada': '🇨🇦', 'Australia': '🇦🇺', 'Japan': '🇯🇵',
            'China': '🇨🇳', 'Russia': '🇷🇺', 'Brazil': '🇧🇷'
        };
        return flags[country] || '🌍';
    }
    
    logVisitorData() {
        try {
            // Store in localStorage for local logging
            const logs = JSON.parse(localStorage.getItem('visitor_logs') || '[]');
            logs.push(this.visitorData);
            
            // Keep only last 100 entries
            if (logs.length > 100) {
                logs.splice(0, logs.length - 100);
            }
            
            localStorage.setItem('visitor_logs', JSON.stringify(logs));
            
            // Also create downloadable log
            this.createDownloadableLog();
            
        } catch (error) {
            console.error('❌ Error logging visitor data:', error);
        }
    }
    
    createDownloadableLog() {
        const logs = JSON.parse(localStorage.getItem('visitor_logs') || '[]');
        const csvHeader = 'timestamp,ip,country,city,browser,device,url,referrer\n';
        const csvData = logs.map(log => 
            `"${log.timestamp}","${log.ip}","${log.country}","${log.city}","${log.browser}","${log.device}","${log.url}","${log.referrer}"`
        ).join('\n');
        
        const csvContent = csvHeader + csvData;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        
        // Store blob URL for download (if needed)
        window.visitorLogDownloadUrl = URL.createObjectURL(blob);
    }
    
    trackPageActivity() {
        // Track when user leaves page
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - new Date(this.visitorData.timestamp).getTime();
            this.visitorData.timeOnPage = Math.round(timeSpent / 1000); // seconds
            
            // Send final update if possible
            if (this.CHAT_ID && navigator.sendBeacon) {
                const finalMessage = `📊 Visitor left page after ${this.visitorData.timeOnPage} seconds`;
                navigator.sendBeacon(this.API_URL, JSON.stringify({
                    chat_id: this.CHAT_ID,
                    text: finalMessage
                }));
            }
        });
        
        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('👁️ Page hidden');
            } else {
                console.log('👁️ Page visible');
            }
        });
    }
}

// Auto-initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.visitorTracker = new VisitorTracker();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // Wait for DOMContentLoaded
} else {
    window.visitorTracker = new VisitorTracker();
}

/*
==============================================================================
End of Visitor Tracking System - Copyright © 2025 Amir Shirkhodaee
GitHub: https://github.com/Amsh23 | Email: amirshirkhodaeetari@gmail.com
DIGITAL SIGNATURE: AmirShirkhodaee-VisitorTracker-v1.0-2025
==============================================================================
*/
