<?php
/*
=============# Telegram Configuration
define('BOT_TOKEN', '7563475603:AAH-bhTQky3DLzTAdA-V3MzzbU2p9zRx6eM');
define('CHAT_ID', '5471707327'); // Updated Chat ID for user @AmSh20003 via bot @amshsocialbot==============================================================
                    CONFIGURATION FILE
                    Copyright © 2025 Amir Shirkhodaee
==============================================================================

SECURITY SETTINGS:
- Update BOT_TOKEN with your actual Telegram bot token
- Update CHAT_ID with your Telegram chat ID  
- Change CHAT_PASSWORD for additional security
- Regularly backup data/ directory

TELEGRAM BOT SETUP:
1. Create bot: Message @BotFather on Telegram
2. Send /newbot command
3. Follow instructions to get bot token
4. Get your chat ID by messaging your bot and visiting:
   https://api.telegram.org/bot<TOKEN>/getUpdates
5. Look for "chat":{"id": and copy the number

==============================================================================
*/

// Telegram Configuration
define('BOT_TOKEN', '7563475603:AAH-bhTQky3DLzTAdA-V3MzzbU2p9zRx6eM');
define('CHAT_ID', '5539055486'); // Your Telegram chat ID

// Security Configuration
define('CHAT_PASSWORD', 'meow'); // Password to access chat system
define('SESSION_TIMEOUT', 86400); // 24 hours in seconds
define('MAX_MESSAGE_LENGTH', 1000);
define('MAX_SESSIONS_PER_IP', 5);

// Directory Configuration
define('DATA_DIR', 'data/');
define('SESSIONS_DIR', DATA_DIR . 'sessions/');
define('LOGS_DIR', DATA_DIR . 'logs/');
define('BACKUPS_DIR', DATA_DIR . 'backups/');

// Site Configuration
define('SITE_URL', 'https://amsh23.github.io/amshsocialmedia/chat-system/');
define('SITE_NAME', 'Amir Shirkhodaee Chat System');
define('ADMIN_EMAIL', 'amirshirkhodaeetari@gmail.com');

// Features Configuration
define('ENABLE_TELEGRAM_NOTIFICATIONS', true);
define('ENABLE_EMAIL_NOTIFICATIONS', false); // Set to true if you want email notifications
define('ENABLE_AUTO_CLOSE_SESSIONS', true);
define('AUTO_CLOSE_AFTER_HOURS', 24);

// Rate Limiting
define('MAX_REQUESTS_PER_MINUTE', 30);
define('MAX_LOGIN_ATTEMPTS_PER_IP', 5);
define('LOGIN_COOLDOWN_MINUTES', 15);

// Logging Configuration
define('LOG_LEVEL', 'INFO'); // DEBUG, INFO, WARNING, ERROR
define('MAX_LOG_FILE_SIZE', 10485760); // 10MB
define('KEEP_LOGS_FOR_DAYS', 30);

// Initialize directories
function initializeDirectories() {
    $directories = [DATA_DIR, SESSIONS_DIR, LOGS_DIR, BACKUPS_DIR];
    
    foreach ($directories as $dir) {
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
            
            // Add .htaccess for security
            $htaccess = $dir . '.htaccess';
            if (!file_exists($htaccess)) {
                file_put_contents($htaccess, "Deny from all\n");
            }
        }
    }
}

// Initialize on load
initializeDirectories();

// Helper function to get configuration as array
function getConfig() {
    return [
        'bot_token' => BOT_TOKEN,
        'chat_id' => CHAT_ID,
        'chat_password' => CHAT_PASSWORD,
        'session_timeout' => SESSION_TIMEOUT,
        'max_message_length' => MAX_MESSAGE_LENGTH,
        'site_url' => SITE_URL,
        'site_name' => SITE_NAME,
        'admin_email' => ADMIN_EMAIL,
        'features' => [
            'telegram_notifications' => ENABLE_TELEGRAM_NOTIFICATIONS,
            'email_notifications' => ENABLE_EMAIL_NOTIFICATIONS,
            'auto_close_sessions' => ENABLE_AUTO_CLOSE_SESSIONS
        ]
    ];
}

// Version information
define('SYSTEM_VERSION', '1.0.0');
define('LAST_UPDATED', '2025-07-19');

/*
==============================================================================
INSTALLATION NOTES:

1. Upload all files to your web server
2. Make sure PHP has write permissions to the data/ directory
3. Update BOT_TOKEN and CHAT_ID in this file
4. Test the system by accessing index.html
5. Access admin.php to manage chat sessions

SECURITY CHECKLIST:
☐ Changed default password from 'meow'
☐ Updated Telegram bot token and chat ID
☐ Ensured data/ directory is not publicly accessible
☐ Configured proper file permissions
☐ Tested authentication system
☐ Verified Telegram notifications work

==============================================================================
*/
?>
