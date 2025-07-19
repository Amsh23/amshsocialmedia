<?php
/*
==============================================================================
                    ADMIN PANEL FOR CHAT MANAGEMENT
                    Copyright © 2025 Amir Shirkhodaee
==============================================================================
*/

// Include authentication
require_once 'auth.php';
checkPassword();

// Handle admin actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    
    $action = $_POST['action'] ?? '';
    $sessionId = $_POST['session'] ?? '';
    
    switch ($action) {
        case 'send_admin_message':
            $message = trim($_POST['message'] ?? '');
            if (!empty($sessionId) && !empty($message)) {
                $result = sendAdminMessage($sessionId, $message);
                echo json_encode($result);
                exit;
            }
            break;
            
        case 'close_session':
            if (!empty($sessionId)) {
                $result = closeSession($sessionId);
                echo json_encode($result);
                exit;
            }
            break;
    }
    
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
    exit;
}

// Get all active sessions
function getActiveSessions() {
    $sessions = [];
    $sessionsDir = 'data/sessions/';
    
    if (is_dir($sessionsDir)) {
        $files = glob($sessionsDir . '*.json');
        foreach ($files as $file) {
            if (strpos($file, '_messages.json') === false) {
                $content = file_get_contents($file);
                $sessionData = json_decode($content, true);
                if ($sessionData && isset($sessionData['session_id'])) {
                    $sessions[] = $sessionData;
                }
            }
        }
    }
    
    // Sort by creation time (newest first)
    usort($sessions, function($a, $b) {
        return $b['created_at'] - $a['created_at'];
    });
    
    return $sessions;
}

// Send admin message
function sendAdminMessage($sessionId, $message) {
    $sessionId = preg_replace('/[^a-zA-Z0-9]/', '', $sessionId);
    $message = htmlspecialchars(trim($message), ENT_QUOTES, 'UTF-8');
    
    if (empty($message) || strlen($message) > 1000) {
        return ['success' => false, 'message' => 'Invalid message'];
    }
    
    try {
        $messagesFile = "data/sessions/{$sessionId}_messages.json";
        $messages = [];
        
        if (file_exists($messagesFile)) {
            $content = file_get_contents($messagesFile);
            $messages = json_decode($content, true) ?: [];
        }
        
        $newMessageId = count($messages) > 0 ? max(array_column($messages, 'id')) + 1 : 1;
        
        $newMessage = [
            'id' => $newMessageId,
            'sender' => 'admin',
            'message' => $message,
            'timestamp' => time(),
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'admin'
        ];
        
        $messages[] = $newMessage;
        
        if (file_put_contents($messagesFile, json_encode($messages, JSON_PRETTY_PRINT)) !== false) {
            return ['success' => true, 'message' => 'Message sent successfully'];
        } else {
            return ['success' => false, 'message' => 'Failed to save message'];
        }
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

// Close session
function closeSession($sessionId) {
    $sessionId = preg_replace('/[^a-zA-Z0-9]/', '', $sessionId);
    $sessionFile = "data/sessions/{$sessionId}.json";
    
    if (file_exists($sessionFile)) {
        $sessionData = json_decode(file_get_contents($sessionFile), true);
        if ($sessionData) {
            $sessionData['status'] = 'closed';
            $sessionData['closed_at'] = time();
            
            if (file_put_contents($sessionFile, json_encode($sessionData, JSON_PRETTY_PRINT))) {
                return ['success' => true, 'message' => 'Session closed successfully'];
            }
        }
    }
    
    return ['success' => false, 'message' => 'Failed to close session'];
}

$activeSessions = getActiveSessions();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🛠️ Chat Admin Panel - Amir Shirkhodaee</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f6fa;
            color: #333;
        }
        
        .admin-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .admin-header h1 {
            font-size: 1.5rem;
        }
        
        .admin-stats {
            font-size: 0.9rem;
        }
        
        .admin-container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
        }
        
        .sessions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .session-card {
            background: white;
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #667eea;
        }
        
        .session-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }
        
        .session-info h3 {
            color: #333;
            margin-bottom: 0.5rem;
        }
        
        .session-info p {
            color: #666;
            font-size: 0.9rem;
            margin: 0.25rem 0;
        }
        
        .session-status {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .status-active {
            background: #d4edda;
            color: #155724;
        }
        
        .status-pending {
            background: #fff3cd;
            color: #856404;
        }
        
        .status-closed {
            background: #f8d7da;
            color: #721c24;
        }
        
        .admin-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-primary {
            background: #667eea;
            color: white;
        }
        
        .btn-primary:hover {
            background: #5a67d8;
        }
        
        .btn-success {
            background: #28a745;
            color: white;
        }
        
        .btn-success:hover {
            background: #218838;
        }
        
        .btn-danger {
            background: #dc3545;
            color: white;
        }
        
        .btn-danger:hover {
            background: #c82333;
        }
        
        .quick-reply {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #eee;
        }
        
        .quick-reply textarea {
            width: 100%;
            min-height: 60px;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            resize: vertical;
            font-size: 0.9rem;
        }
        
        .empty-state {
            text-align: center;
            padding: 3rem;
            color: #666;
        }
        
        .empty-state i {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }
        
        .refresh-btn {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }
        
        .refresh-btn:hover {
            transform: scale(1.1);
        }
        
        @media (max-width: 768px) {
            .sessions-grid {
                grid-template-columns: 1fr;
            }
            
            .admin-header {
                flex-direction: column;
                gap: 0.5rem;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="admin-header">
        <h1>🛠️ Chat Admin Panel</h1>
        <div class="admin-stats">
            <?php 
            $activeCount = count(array_filter($activeSessions, function($s) { 
                return ($s['status'] ?? 'pending') !== 'closed'; 
            }));
            ?>
            📊 <?= count($activeSessions) ?> Total Sessions • <?= $activeCount ?> Active
        </div>
    </div>
    
    <div class="admin-container">
        <?php if (empty($activeSessions)): ?>
            <div class="empty-state">
                <div style="font-size: 3rem; margin-bottom: 1rem;">💬</div>
                <h3>No Chat Sessions</h3>
                <p>No chat sessions found. New sessions will appear here automatically.</p>
            </div>
        <?php else: ?>
            <div class="sessions-grid">
                <?php foreach ($activeSessions as $session): ?>
                    <div class="session-card">
                        <div class="session-header">
                            <div class="session-info">
                                <h3><?= htmlspecialchars($session['name']) ?></h3>
                                <p>📧 <?= htmlspecialchars($session['email']) ?></p>
                                <?php if (!empty($session['telegram'])): ?>
                                    <p>📱 <?= htmlspecialchars($session['telegram']) ?></p>
                                <?php endif; ?>
                                <p>💭 <?= htmlspecialchars($session['subject']) ?></p>
                                <p>⏰ <?= date('Y-m-d H:i:s', $session['created_at']) ?></p>
                                <?php if (isset($session['last_access'])): ?>
                                    <p>👁️ Last seen: <?= date('H:i:s', $session['last_access']) ?></p>
                                <?php endif; ?>
                            </div>
                            <span class="session-status status-<?= $session['status'] ?? 'pending' ?>">
                                <?= ucfirst($session['status'] ?? 'pending') ?>
                            </span>
                        </div>
                        
                        <div class="admin-actions">
                            <a href="chat.php?session=<?= $session['session_id'] ?>" 
                               class="btn btn-primary" target="_blank">
                                💬 Join Chat
                            </a>
                            
                            <?php if (($session['status'] ?? 'pending') !== 'closed'): ?>
                                <button class="btn btn-danger" 
                                        onclick="closeSession('<?= $session['session_id'] ?>')">
                                    🔒 Close Session
                                </button>
                            <?php endif; ?>
                        </div>
                        
                        <?php if (($session['status'] ?? 'pending') !== 'closed'): ?>
                            <div class="quick-reply">
                                <textarea placeholder="Quick reply message..." 
                                         id="reply-<?= $session['session_id'] ?>"></textarea>
                                <button class="btn btn-success" style="margin-top: 0.5rem;"
                                        onclick="sendQuickReply('<?= $session['session_id'] ?>')">
                                    ✉️ Send Reply
                                </button>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
    
    <button class="refresh-btn" onclick="location.reload()" title="Refresh">
        🔄
    </button>

    <script>
        // Send quick reply
        async function sendQuickReply(sessionId) {
            const textarea = document.getElementById(`reply-${sessionId}`);
            const message = textarea.value.trim();
            
            if (!message) {
                alert('Please enter a message');
                return;
            }
            
            try {
                const response = await fetch('admin.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `action=send_admin_message&session=${sessionId}&message=${encodeURIComponent(message)}`
                });
                
                const result = await response.json();
                
                if (result.success) {
                    textarea.value = '';
                    alert('Message sent successfully!');
                } else {
                    alert('Failed to send message: ' + result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to send message. Please try again.');
            }
        }
        
        // Close session
        async function closeSession(sessionId) {
            if (!confirm('Are you sure you want to close this session?')) {
                return;
            }
            
            try {
                const response = await fetch('admin.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `action=close_session&session=${sessionId}`
                });
                
                const result = await response.json();
                
                if (result.success) {
                    location.reload();
                } else {
                    alert('Failed to close session: ' + result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to close session. Please try again.');
            }
        }
        
        // Auto-refresh every 30 seconds
        setInterval(() => {
            location.reload();
        }, 30000);
    </script>
</body>
</html>
