<?php
/*
==============================================================================
                    SECURE CHAT INTERFACE
                    Copyright © 2025 Amir Shirkhodaee
==============================================================================
*/

// Include authentication
require_once 'auth.php';
checkPassword();

// Get session ID from URL
$sessionId = $_GET['session'] ?? '';

if (empty($sessionId)) {
    die('Invalid session ID');
}

// Validate session
$sessionFile = "data/sessions/{$sessionId}.json";
if (!file_exists($sessionFile)) {
    die('Session not found');
}

$sessionData = json_decode(file_get_contents($sessionFile), true);
if (!$sessionData) {
    die('Invalid session data');
}

// Update session status to active
$sessionData['status'] = 'active';
$sessionData['last_access'] = time();
file_put_contents($sessionFile, json_encode($sessionData, JSON_PRETTY_PRINT));
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💬 Chat with Amir - <?= htmlspecialchars($sessionData['name']) ?></title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            overflow: hidden;
        }
        
        .chat-container {
            display: flex;
            flex-direction: column;
            height: 100vh;
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        
        .chat-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .chat-header h1 {
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .chat-status {
            font-size: 0.8rem;
            opacity: 0.9;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .status-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #4CAF50;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
            background: #f8f9fa;
        }
        
        .message {
            margin-bottom: 1rem;
            animation: messageSlide 0.3s ease-in;
        }
        
        @keyframes messageSlide {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .message.user {
            display: flex;
            justify-content: flex-end;
        }
        
        .message.admin {
            display: flex;
            justify-content: flex-start;
        }
        
        .message.system {
            display: flex;
            justify-content: center;
        }
        
        .message-content {
            max-width: 70%;
            padding: 0.75rem 1rem;
            border-radius: 18px;
            word-wrap: break-word;
        }
        
        .message.user .message-content {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .message.admin .message-content {
            background: #e9ecef;
            color: #333;
        }
        
        .message.system .message-content {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
            font-size: 0.9rem;
            font-style: italic;
        }
        
        .message-info {
            font-size: 0.7rem;
            color: #666;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .message.user .message-info {
            justify-content: flex-end;
        }
        
        .chat-input-container {
            padding: 1rem 1.5rem;
            background: white;
            border-top: 1px solid #e9ecef;
        }
        
        .chat-input-form {
            display: flex;
            gap: 0.5rem;
            align-items: flex-end;
        }
        
        .chat-input {
            flex: 1;
            min-height: 40px;
            max-height: 120px;
            padding: 0.75rem;
            border: 2px solid #e9ecef;
            border-radius: 20px;
            font-size: 1rem;
            resize: none;
            outline: none;
            transition: border-color 0.3s ease;
        }
        
        .chat-input:focus {
            border-color: #667eea;
        }
        
        .send-button {
            width: 50px;
            height: 40px;
            border: none;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .send-button:hover {
            transform: scale(1.1);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }
        
        .send-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .typing-indicator {
            padding: 0.5rem 1rem;
            color: #666;
            font-style: italic;
            font-size: 0.9rem;
            display: none;
        }
        
        .session-info {
            background: #e7f3ff;
            border: 1px solid #b6d7ff;
            border-radius: 8px;
            padding: 0.75rem;
            margin-bottom: 1rem;
            color: #004085;
            font-size: 0.9rem;
        }
        
        .char-counter {
            font-size: 0.8rem;
            color: #666;
            text-align: right;
            margin-top: 0.25rem;
        }
        
        .loading-messages {
            text-align: center;
            padding: 2rem;
            color: #666;
        }
        
        @media (max-width: 600px) {
            .chat-container {
                height: 100vh;
            }
            
            .message-content {
                max-width: 85%;
            }
            
            .chat-header {
                padding: 0.75rem 1rem;
            }
            
            .chat-header h1 {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="chat-header">
            <div>
                <h1>💬 Chat with Amir Shirkhodaee</h1>
                <div class="chat-status">
                    <span class="status-indicator"></span>
                    <span id="connectionStatus">Connected</span>
                </div>
            </div>
            <div style="text-align: right; font-size: 0.8rem;">
                <div><?= htmlspecialchars($sessionData['name']) ?></div>
                <div><?= htmlspecialchars($sessionData['subject']) ?></div>
            </div>
        </div>
        
        <div class="chat-messages" id="chatMessages">
            <div class="session-info">
                ℹ️ <strong>Secure Chat Session</strong><br>
                This is a private conversation between you and Amir. 
                Session ID: <code><?= htmlspecialchars($sessionId) ?></code>
            </div>
            
            <div class="loading-messages">
                <div>Loading chat history...</div>
            </div>
        </div>
        
        <div class="typing-indicator" id="typingIndicator">
            Amir is typing...
        </div>
        
        <div class="chat-input-container">
            <form class="chat-input-form" id="messageForm">
                <textarea 
                    class="chat-input" 
                    id="messageInput" 
                    placeholder="Type your message here..." 
                    rows="1"
                    maxlength="1000"
                ></textarea>
                <button type="submit" class="send-button" id="sendButton">
                    📤
                </button>
            </form>
            <div class="char-counter">
                <span id="charCount">0</span>/1000 characters
            </div>
        </div>
    </div>

    <script>
        // Configuration
        const sessionId = '<?= $sessionId ?>';
        const userName = '<?= htmlspecialchars($sessionData['name']) ?>';
        let lastMessageId = 0;
        let isLoading = false;
        
        // DOM elements
        const messagesContainer = document.getElementById('chatMessages');
        const messageForm = document.getElementById('messageForm');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const charCount = document.getElementById('charCount');
        const typingIndicator = document.getElementById('typingIndicator');
        const connectionStatus = document.getElementById('connectionStatus');
        
        // Auto-resize textarea
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            
            // Update character count
            charCount.textContent = this.value.length;
            
            // Enable/disable send button
            sendButton.disabled = this.value.trim().length === 0;
        });
        
        // Handle form submission
        messageForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await sendMessage();
        });
        
        // Handle Enter key (Shift+Enter for new line)
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                messageForm.dispatchEvent(new Event('submit'));
            }
        });
        
        // Send message function
        async function sendMessage() {
            const message = messageInput.value.trim();
            if (!message || isLoading) return;
            
            isLoading = true;
            sendButton.disabled = true;
            sendButton.innerHTML = '⏳';
            
            try {
                const response = await fetch('send_message.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `session=${sessionId}&message=${encodeURIComponent(message)}&sender=user`
                });
                
                const result = await response.json();
                
                if (result.success) {
                    messageInput.value = '';
                    messageInput.style.height = 'auto';
                    charCount.textContent = '0';
                    await fetchMessages();
                } else {
                    alert('Failed to send message: ' + result.message);
                }
            } catch (error) {
                console.error('Send error:', error);
                connectionStatus.textContent = 'Connection Error';
                alert('Failed to send message. Please check your connection.');
            }
            
            isLoading = false;
            sendButton.disabled = false;
            sendButton.innerHTML = '📤';
        }
        
        // Fetch messages function
        async function fetchMessages() {
            try {
                const response = await fetch(`fetch_messages.php?session=${sessionId}&after=${lastMessageId}`);
                const result = await response.json();
                
                if (result.success) {
                    connectionStatus.textContent = 'Connected';
                    
                    if (result.messages && result.messages.length > 0) {
                        // Remove loading indicator if it exists
                        const loadingDiv = messagesContainer.querySelector('.loading-messages');
                        if (loadingDiv) {
                            loadingDiv.remove();
                        }
                        
                        result.messages.forEach(msg => {
                            displayMessage(msg);
                            lastMessageId = Math.max(lastMessageId, msg.id);
                        });
                        
                        // Scroll to bottom
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }
                } else {
                    connectionStatus.textContent = 'Error';
                }
            } catch (error) {
                console.error('Fetch error:', error);
                connectionStatus.textContent = 'Connection Error';
            }
        }
        
        // Display message function
        function displayMessage(msg) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender}`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.textContent = msg.message;
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'message-info';
            
            const senderName = msg.sender === 'user' ? userName : 
                             msg.sender === 'admin' ? 'Amir' : 'System';
            const timestamp = new Date(msg.timestamp * 1000).toLocaleTimeString();
            
            infoDiv.innerHTML = `<span>${senderName}</span> • <span>${timestamp}</span>`;
            
            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(infoDiv);
            
            messagesContainer.appendChild(messageDiv);
        }
        
        // Initial load
        fetchMessages();
        
        // Poll for new messages every 3 seconds
        setInterval(fetchMessages, 3000);
        
        // Focus input on load
        messageInput.focus();
        
        // Update page title with unread indicator (basic implementation)
        let originalTitle = document.title;
        let hasNewMessages = false;
        
        window.addEventListener('focus', function() {
            hasNewMessages = false;
            document.title = originalTitle;
        });
    </script>
</body>
</html>
