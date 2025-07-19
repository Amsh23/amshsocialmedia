<?php
/*
=========# Configuration
define('BOT_TOKEN', '7563475603:AAH-bhTQky3DLzTAdA-V3MzzbU2p9zRx6eM');
define('CHAT_ID', '5471707327'); // Updated Chat ID for user @AmSh20003 via bot @amshsocialbot
define('SESSIONS_DIR', 'data/sessions/');=================================================================
                    SECURE CHAT LOGIN HANDLER
                    Copyright © 2025 Amir Shirkhodaee
==============================================================================

FEATURES:
- Secure session generation
- Telegram notification
- File-based data storage
- Input validation and sanitization

==============================================================================
*/

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuration
define('BOT_TOKEN', '7563475603:AAH-bhTQky3DLzTAdA-V3MzzbU2p9zRx6eM');
define('CHAT_ID', '5471707327'); // Updated Chat ID for user @AmSh20003 via bot @amshsocialbot
define('SESSIONS_DIR', 'data/sessions/');
define('LOGS_DIR', 'data/logs/');
define('CHAT_PASSWORD', 'meow'); // Password for accessing chat pages

// Create directories if they don't exist
if (!file_exists('data/')) mkdir('data/', 0755, true);
if (!file_exists(SESSIONS_DIR)) mkdir(SESSIONS_DIR, 0755, true);
if (!file_exists(LOGS_DIR)) mkdir(LOGS_DIR, 0755, true);

// Helper function to generate secure session key
function generateSecureSession() {
    return bin2hex(random_bytes(32)); // 64-character hex string
}

// Helper function to sanitize input
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

// Helper function to send Telegram message
function sendToTelegram($message) {
    $url = "https://api.telegram.org/bot" . BOT_TOKEN . "/sendMessage";
    $data = [
        'chat_id' => CHAT_ID,
        'text' => $message,
        'parse_mode' => 'HTML'
    ];
    
    $options = [
        'http' => [
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        ]
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    return $result !== FALSE;
}

// Helper function to log activity
function logActivity($action, $data) {
    $logFile = LOGS_DIR . 'activity_' . date('Y-m-d') . '.txt';
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] $action: " . json_encode($data) . PHP_EOL;
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// Set JSON response header
header('Content-Type: application/json');

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Validate required fields
        $requiredFields = ['name', 'email', 'subject'];
        foreach ($requiredFields as $field) {
            if (empty($_POST[$field])) {
                throw new Exception("Field '$field' is required");
            }
        }
        
        // Sanitize inputs
        $name = sanitizeInput($_POST['name']);
        $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
        $telegram = !empty($_POST['telegram']) ? sanitizeInput($_POST['telegram']) : '';
        $subject = sanitizeInput($_POST['subject']);
        
        if (!$email) {
            throw new Exception("Invalid email address");
        }
        
        // Generate secure session
        $sessionId = generateSecureSession();
        $timestamp = time();
        $chatUrl = "https://amsh23.github.io/amshsocialmedia/chat-system/chat.php?session=" . $sessionId;
        
        // Prepare session data
        $sessionData = [
            'session_id' => $sessionId,
            'name' => $name,
            'email' => $email,
            'telegram' => $telegram,
            'subject' => $subject,
            'created_at' => $timestamp,
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
            'status' => 'pending',
            'chat_url' => $chatUrl
        ];
        
        // Save session to file
        $sessionFile = SESSIONS_DIR . $sessionId . '.json';
        if (file_put_contents($sessionFile, json_encode($sessionData, JSON_PRETTY_PRINT)) === false) {
            throw new Exception("Failed to create session file");
        }
        
        // Create chat messages file
        $messagesFile = SESSIONS_DIR . $sessionId . '_messages.json';
        $initialMessages = [
            [
                'id' => 1,
                'sender' => 'system',
                'message' => 'Chat session initiated. Waiting for admin to join...',
                'timestamp' => time()
            ]
        ];
        file_put_contents($messagesFile, json_encode($initialMessages, JSON_PRETTY_PRINT));
        
        // Format Telegram notification
        $telegramMessage = "🆕 <b>New Chat Session Request</b>\n\n";
        $telegramMessage .= "👤 <b>Name:</b> $name\n";
        $telegramMessage .= "📧 <b>Email:</b> $email\n";
        if ($telegram) {
            $telegramMessage .= "📱 <b>Telegram:</b> $telegram\n";
        }
        $telegramMessage .= "💭 <b>Subject:</b> $subject\n";
        $telegramMessage .= "🌐 <b>IP:</b> {$sessionData['ip_address']}\n";
        $telegramMessage .= "⏰ <b>Time:</b> " . date('Y-m-d H:i:s', $timestamp) . "\n\n";
        $telegramMessage .= "🔗 <b>Chat Link:</b>\n<code>$chatUrl</code>\n\n";
        $telegramMessage .= "📋 <b>Session ID:</b> <code>$sessionId</code>";
        
        // Send to Telegram
        if (!sendToTelegram($telegramMessage)) {
            logActivity('TELEGRAM_FAIL', ['session' => $sessionId, 'error' => 'Failed to send notification']);
            // Don't fail the request if Telegram fails, just log it
        }
        
        // Log the activity
        logActivity('SESSION_CREATED', $sessionData);
        
        // Return success response
        echo json_encode([
            'success' => true,
            'message' => 'Chat request sent successfully! You will be redirected to the waiting page.',
            'session' => $sessionId
        ]);
        
    } catch (Exception $e) {
        // Log error
        logActivity('LOGIN_ERROR', ['error' => $e->getMessage(), 'post_data' => $_POST]);
        
        // Return error response
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} else {
    // Invalid request method
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
}
?>
