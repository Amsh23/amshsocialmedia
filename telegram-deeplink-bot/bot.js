/*
==============================================================================
                    TELEGRAM DEEP LINK BOT
                    Copyright © 2025 Amir Shirkhodaee
==============================================================================

AUTHOR: Amir Shirkhodaee
DATE: July 2, 2025
VERSION: v1.0
GITHUB: https://github.com/Amsh23
EMAIL: amirshirkhodaeetari@gmail.com

FEATURES:
- Deep linking support with start parameters
- User tracking and logging
- Custom welcome messages based on source
- Secure token management
- Source analytics

DIGITAL SIGNATURE: AmirShirkhodaee-TelegramDeepLinkBot-v1.0-2025

==============================================================================
*/

// Load environment variables
require('dotenv').config();

// Import required modules
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// Bot configuration
const BOT_TOKEN = process.env.BOT_TOKEN;

// Validate bot token
if (!BOT_TOKEN) {
    console.error('❌ BOT_TOKEN not found in .env file!');
    process.exit(1);
}

// Create bot instance
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Log file path
const LOG_FILE = path.join(__dirname, 'user_visits.log');

// Initialize log file if it doesn't exist
if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, 'timestamp,user_id,username,first_name,source_param\n');
    console.log('📄 Created new log file:', LOG_FILE);
}

// Function to log user visit
function logUserVisit(userId, username, firstName, sourceParam = 'direct') {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp},${userId},"${username || 'none'}","${firstName || 'Unknown'}","${sourceParam}"\n`;
    
    try {
        fs.appendFileSync(LOG_FILE, logEntry);
        console.log(`📝 Logged visit: User ${userId} from source "${sourceParam}"`);
    } catch (error) {
        console.error('❌ Failed to write to log file:', error.message);
    }
}

// Function to get custom welcome message based on source
function getWelcomeMessage(firstName, sourceParam) {
    const name = firstName || 'کاربر گرامی';
    
    // Default welcome message
    if (!sourceParam || sourceParam === 'direct') {
        return `سلام ${name}! 🌟\nخوش اومدی به ربات ما`;
    }
    
    // Custom messages based on source parameter
    const sourceMessages = {
        'fromsite_123': `سلام ${name} 🌟\nشما از منبع \`fromsite_123\` وارد شدید!\nخوش آمدید.`,
        'website': `سلام ${name} 🌐\nازیاکه از وب‌سایت ما اومدی خوش آمدی!\nامیدوارم از محتوای ما لذت ببری.`,
        'social_media': `سلام ${name} 📱\nاز شبکه‌های اجتماعی پیدامون کردی!\nعالیه که اینجایی.`,
        'github': `سلام ${name} 💻\nاز GitHub اومدی؟ حتماً برنامه‌نویسی!\nخوش آمدی برادر کدر.`,
        'instagram': `سلام ${name} 📸\nاز اینستاگرام اومدی!\nخوش آمدی به دنیای ربات‌ها.`,
        'telegram_channel': `سلام ${name} 📢\nاز کانال تلگرام ما اومدی!\nممنون که عضو جامعه‌مون هستی.`
    };
    
    // Return custom message if exists, otherwise generic source message
    return sourceMessages[sourceParam] || 
           `سلام ${name} 🌟\nشما از منبع \`${sourceParam}\` وارد شدید!\nخوش آمدید.`;
}

// Function to get source statistics
function getSourceStats() {
    try {
        const logContent = fs.readFileSync(LOG_FILE, 'utf8');
        const lines = logContent.split('\n').filter(line => line.trim() && !line.startsWith('timestamp'));
        
        const stats = {};
        let totalVisits = 0;
        
        lines.forEach(line => {
            const columns = line.split(',');
            if (columns.length >= 5) {
                const source = columns[4].replace(/"/g, '');
                stats[source] = (stats[source] || 0) + 1;
                totalVisits++;
            }
        });
        
        return { stats, totalVisits };
    } catch (error) {
        console.error('❌ Error reading stats:', error.message);
        return { stats: {}, totalVisits: 0 };
    }
}

// Handle /start command with deep link parameter
bot.onText(/\/start(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const username = msg.from.username;
    const firstName = msg.from.first_name;
    
    // Extract start parameter
    const startParam = match[1] ? match[1].trim() : '';
    const sourceParam = startParam || 'direct';
    
    console.log(`👤 User ${userId} (${firstName}) started bot with param: "${sourceParam}"`);
    
    // Log the visit
    logUserVisit(userId, username, firstName, sourceParam);
    
    // Get and send welcome message
    const welcomeMessage = getWelcomeMessage(firstName, sourceParam);
    
    bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🌐 وب‌سایت ما', url: 'https://amsh23.github.io/amshsocialmedia/' },
                    { text: '📊 آمار بازدید', callback_data: 'show_stats' }
                ],
                [
                    { text: '💬 راهنما', callback_data: 'show_help' }
                ]
            ]
        }
    });
});

// Handle inline keyboard callbacks
bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    
    if (data === 'show_stats') {
        const { stats, totalVisits } = getSourceStats();
        
        let statsMessage = `📊 *آمار بازدید ربات*\n\n`;
        statsMessage += `👥 کل بازدیدها: ${totalVisits}\n\n`;
        
        if (Object.keys(stats).length > 0) {
            statsMessage += `📈 *آمار منابع:*\n`;
            Object.entries(stats)
                .sort(([,a], [,b]) => b - a)
                .forEach(([source, count]) => {
                    const percentage = ((count / totalVisits) * 100).toFixed(1);
                    statsMessage += `• ${source}: ${count} نفر (${percentage}%)\n`;
                });
        } else {
            statsMessage += `هنوز آماری وجود ندارد.`;
        }
        
        bot.sendMessage(chatId, statsMessage, { parse_mode: 'Markdown' });
        
    } else if (data === 'show_help') {
        const helpMessage = `📚 *راهنمای ربات*\n\n` +
            `این ربات از طریق deep linking کار می‌کند.\n\n` +
            `🔗 *نمونه لینک‌ها:*\n` +
            `• \`https://t.me/BOT_USERNAME?start=website\`\n` +
            `• \`https://t.me/BOT_USERNAME?start=github\`\n` +
            `• \`https://t.me/BOT_USERNAME?start=fromsite_123\`\n\n` +
            `💡 هر کدام پیام خوش‌آمد مخصوص خود را دارند!`;
        
        bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
    }
    
    // Answer callback query to remove loading state
    bot.answerCallbackQuery(callbackQuery.id);
});

// Handle other messages
bot.on('message', (msg) => {
    // Skip if it's a /start command (already handled above)
    if (msg.text && msg.text.startsWith('/start')) {
        return;
    }
    
    const chatId = msg.chat.id;
    
    // Simple echo or help for other messages
    if (msg.text) {
        bot.sendMessage(chatId, 
            `سلام! 👋\nمن فقط پیام‌های /start رو پردازش می‌کنم.\n\n` +
            `برای شروع دوباره از دستور /start استفاده کنید.`
        );
    }
});

// Error handling
bot.on('error', (error) => {
    console.error('❌ Bot error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n📴 Shutting down bot gracefully...');
    bot.stopPolling();
    process.exit(0);
});

// Bot startup message
console.log('🤖 Telegram Deep Link Bot started successfully!');
console.log(`📊 Log file: ${LOG_FILE}`);
console.log('👂 Listening for messages...');

// Test function (for development)
function testBot() {
    console.log('\n🧪 Testing bot functions...');
    
    // Test log function
    logUserVisit('123456', 'testuser', 'Test User', 'test_source');
    
    // Test message generation
    console.log('📝 Sample welcome message:');
    console.log(getWelcomeMessage('تست', 'fromsite_123'));
    
    console.log('✅ Test completed!\n');
}

// Uncomment the line below for testing
// testBot();

/*
==============================================================================
End of Telegram Deep Link Bot - Copyright © 2025 Amir Shirkhodaee
GitHub: https://github.com/Amsh23 | Email: amirshirkhodaeetari@gmail.com
DIGITAL SIGNATURE: AmirShirkhodaee-TelegramDeepLinkBot-v1.0-2025

Usage Examples:
- Direct: https://t.me/BOT_USERNAME?start=
- Website: https://t.me/BOT_USERNAME?start=website
- GitHub: https://t.me/BOT_USERNAME?start=github
- Custom: https://t.me/BOT_USERNAME?start=fromsite_123

==============================================================================
*/
