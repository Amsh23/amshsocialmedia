/*
==============================================================================
                    TELEGRAM RELAY SERVER
                    Copyright © 2025 Amir Shirkhodaee
==============================================================================

AUTHOR: Amir Shirkhodaee
DATE: July 2, 2025
VERSION: v1.0
GITHUB: https://github.com/Amsh23
EMAIL: amirshirkhodaeetari@gmail.com

FEATURES:
- Secure relay between static sites and Telegram Bot API
- Express.js REST API with CORS support
- Environment-based configuration
- Error handling and validation
- Ready for Railway/Render/Cloudflare deployment

DIGITAL SIGNATURE: AmirShirkhodaee-TelegramRelay-v1.0-2025

==============================================================================
*/

// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const axios = require('axios');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware setup
app.use(express.json({ limit: '10mb' })); // Parse JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const PORT = process.env.PORT || 3000;

// Validate required environment variables
if (!BOT_TOKEN || !CHAT_ID) {
    console.error('❌ Missing required environment variables: BOT_TOKEN and CHAT_ID');
    process.exit(1);
}

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Telegram Relay Server is running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Main endpoint: Send message to Telegram
app.post('/send', async (req, res) => {
    try {
        // Extract message from request body
        const { message } = req.body;
        
        // Validate input
        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ 
                error: 'Message is required and must be a non-empty string',
                success: false 
            });
        }
        
        // Limit message length for security
        if (message.length > 4096) {
            return res.status(400).json({ 
                error: 'Message too long. Maximum 4096 characters allowed',
                success: false 
            });
        }
        
        // Prepare Telegram API request
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const telegramPayload = {
            chat_id: CHAT_ID,
            text: message.trim(),
            parse_mode: 'HTML' // Allow basic HTML formatting
        };
        
        // Send message to Telegram
        const response = await axios.post(telegramUrl, telegramPayload, {
            timeout: 10000 // 10 second timeout
        });
        
        // Check if Telegram API request was successful
        if (response.data.ok) {
            console.log(`✅ Message sent successfully: "${message.substring(0, 50)}..."`);
            res.json({ 
                success: true, 
                message: 'Message sent successfully to Telegram',
                timestamp: new Date().toISOString()
            });
        } else {
            console.error('❌ Telegram API error:', response.data);
            res.status(500).json({ 
                error: 'Failed to send message to Telegram',
                success: false 
            });
        }
        
    } catch (error) {
        console.error('❌ Server error:', error.message);
        
        // Handle different types of errors
        if (error.code === 'ECONNABORTED') {
            res.status(408).json({ 
                error: 'Request timeout. Please try again',
                success: false 
            });
        } else if (error.response) {
            // Telegram API returned an error
            res.status(500).json({ 
                error: 'Telegram service error',
                success: false 
            });
        } else {
            // General server error
            res.status(500).json({ 
                error: 'Internal server error',
                success: false 
            });
        }
    }
});

// Handle 404 errors
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: 'Please use POST /send to send messages',
        success: false
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('❌ Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        success: false
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Telegram Relay Server running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/`);
    console.log(`📤 Send endpoint: http://localhost:${PORT}/send`);
    console.log(`🤖 Bot configured for chat ID: ${CHAT_ID}`);
});

/*
==============================================================================
End of Telegram Relay Server - Copyright © 2025 Amir Shirkhodaee
GitHub: https://github.com/Amsh23 | Email: amirshirkhodaeetari@gmail.com
DIGITAL SIGNATURE: AmirShirkhodaee-TelegramRelay-v1.0-2025
==============================================================================
*/
