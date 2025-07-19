<?php
/*
==============================================================================
                    MESSAGE SENDING ENDPOINT
                    Copyright © 2025 Amir Shirkhodaee
==============================================================================
*/

// Include authentication
require_once 'auth.php';
checkPassword();

header('Content-Type: application/json');

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get parameters
$sessionId = $_POST['session'] ?? '';
$message = trim($_POST['message'] ?? '');
$sender = $_POST['sender'] ?? 'user';

// Validate inputs
if (empty($sessionId) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
    exit;
}

// Sanitize inputs
$sessionId = preg_replace('/[^a-zA-Z0-9]/', '', $sessionId);
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
$sender = in_array($sender, ['user', 'admin', 'system']) ? $sender : 'user';

// Validate session
$sessionFile = "data/sessions/{$sessionId}.json";
if (!file_exists($sessionFile)) {
    echo json_encode(['success' => false, 'message' => 'Invalid session']);
    exit;
}

$sessionData = json_decode(file_get_contents($sessionFile), true);
if (!$sessionData) {
    echo json_encode(['success' => false, 'message' => 'Invalid session data']);
    exit;
}

// Check message length
if (strlen($message) > 1000) {
    echo json_encode(['success' => false, 'message' => 'Message too long']);
    exit;
}

try {
    // Load existing messages
    $messagesFile = "data/sessions/{$sessionId}_messages.json";
    $messages = [];
    
    if (file_exists($messagesFile)) {
        $content = file_get_contents($messagesFile);
        $messages = json_decode($content, true) ?: [];
    }
    
    // Generate new message ID
    $newMessageId = count($messages) > 0 ? max(array_column($messages, 'id')) + 1 : 1;
    
    // Create new message
    $newMessage = [
        'id' => $newMessageId,
        'sender' => $sender,
        'message' => $message,
        'timestamp' => time(),
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ];
    
    // Add to messages array
    $messages[] = $newMessage;
    
    // Save messages
    if (file_put_contents($messagesFile, json_encode($messages, JSON_PRETTY_PRINT)) === false) {
        throw new Exception('Failed to save message');
    }
    
    // If this is a user message, send notification to Telegram
    if ($sender === 'user') {
        sendTelegramNotification($sessionData, $newMessage);
    }
    
    // Log activity
    logActivity('MESSAGE_SENT', [
        'session' => $sessionId,
        'sender' => $sender,
        'message_id' => $newMessageId,
        'message_length' => strlen($message)
    ]);
    
    // Return success
    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully',
        'message_id' => $newMessageId
    ]);
    
} catch (Exception $e) {
    // Log error
    logActivity('MESSAGE_ERROR', [
        'session' => $sessionId,
        'error' => $e->getMessage()
    ]);
    
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send message: ' . $e->getMessage()
    ]);
}

// Helper function to send Telegram notification
function sendTelegramNotification($sessionData, $message) {
    define('BOT_TOKEN', '7563475603:AAH-bhTQky3DLzTAdA-V3MzzbU2p9zRx6eM');
    define('CHAT_ID', '5471707327'); // Updated Chat ID for @AmSh20003
    
    $telegramMessage = "💬 <b>New Message in Chat Session</b>\n\n";
    $telegramMessage .= "👤 <b>From:</b> " . htmlspecialchars($sessionData['name']) . "\n";
    $telegramMessage .= "📧 <b>Email:</b> " . htmlspecialchars($sessionData['email']) . "\n";
    $telegramMessage .= "💭 <b>Subject:</b> " . htmlspecialchars($sessionData['subject']) . "\n\n";
    $telegramMessage .= "📝 <b>Message:</b>\n" . htmlspecialchars($message['message']) . "\n\n";
    $telegramMessage .= "⏰ <b>Time:</b> " . date('Y-m-d H:i:s', $message['timestamp']) . "\n";
    $telegramMessage .= "🔗 <b>Reply via Chat:</b>\n";
    $telegramMessage .= "<code>" . $sessionData['chat_url'] . "</code>";
    
    $url = "https://api.telegram.org/bot" . BOT_TOKEN . "/sendMessage";
    $data = [
        'chat_id' => CHAT_ID,
        'text' => $telegramMessage,
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
    $logFile = 'data/logs/activity_' . date('Y-m-d') . '.txt';
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] $action: " . json_encode($data) . PHP_EOL;
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}
?>
