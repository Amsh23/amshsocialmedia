<?php
/*
==============================================================================
                    MESSAGE FETCHING ENDPOINT
                    Copyright © 2025 Amir Shirkhodaee
==============================================================================
*/

// Include authentication
require_once 'auth.php';
checkPassword();

header('Content-Type: application/json');

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get parameters
$sessionId = $_GET['session'] ?? '';
$afterMessageId = intval($_GET['after'] ?? 0);

// Validate session ID
if (empty($sessionId)) {
    echo json_encode(['success' => false, 'message' => 'Missing session ID']);
    exit;
}

// Sanitize session ID
$sessionId = preg_replace('/[^a-zA-Z0-9]/', '', $sessionId);

// Validate session exists
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

try {
    // Load messages
    $messagesFile = "data/sessions/{$sessionId}_messages.json";
    $allMessages = [];
    
    if (file_exists($messagesFile)) {
        $content = file_get_contents($messagesFile);
        $allMessages = json_decode($content, true) ?: [];
    }
    
    // Filter messages after the specified ID
    $newMessages = [];
    foreach ($allMessages as $msg) {
        if ($msg['id'] > $afterMessageId) {
            // Remove sensitive data before sending
            $filteredMessage = [
                'id' => $msg['id'],
                'sender' => $msg['sender'],
                'message' => $msg['message'],
                'timestamp' => $msg['timestamp']
            ];
            $newMessages[] = $filteredMessage;
        }
    }
    
    // Update session last access time
    $sessionData['last_access'] = time();
    file_put_contents($sessionFile, json_encode($sessionData, JSON_PRETTY_PRINT));
    
    // Return messages
    echo json_encode([
        'success' => true,
        'messages' => $newMessages,
        'total_messages' => count($allMessages),
        'session_status' => $sessionData['status'] ?? 'active'
    ]);
    
} catch (Exception $e) {
    // Log error
    logActivity('FETCH_ERROR', [
        'session' => $sessionId,
        'error' => $e->getMessage()
    ]);
    
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch messages: ' . $e->getMessage()
    ]);
}

// Helper function to log activity
function logActivity($action, $data) {
    $logFile = 'data/logs/activity_' . date('Y-m-d') . '.txt';
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] $action: " . json_encode($data) . PHP_EOL;
    
    // Ensure logs directory exists
    if (!file_exists('data/logs/')) {
        mkdir('data/logs/', 0755, true);
    }
    
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}
?>
