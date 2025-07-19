<?php
/*
==============================================================================
                    WAITING PAGE FOR CHAT SESSION
                    Copyright © 2025 Amir Shirkhodaee
==============================================================================
*/

// Get session ID from URL
$sessionId = $_GET['session'] ?? '';

if (empty($sessionId)) {
    header('Location: index.html');
    exit;
}

// Validate session exists
$sessionFile = "data/sessions/{$sessionId}.json";
if (!file_exists($sessionFile)) {
    $error = "Invalid session ID";
} else {
    $sessionData = json_decode(file_get_contents($sessionFile), true);
    if (!$sessionData) {
        $error = "Invalid session data";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Waiting for Chat - Amir Shirkhodaee</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .waiting-container {
            background: white;
            padding: 3rem;
            border-radius: 15px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 500px;
            margin: 20px;
            text-align: center;
        }
        
        .waiting-header h1 {
            color: #333;
            margin-bottom: 1rem;
            font-size: 2rem;
        }
        
        .waiting-animation {
            margin: 2rem 0;
        }
        
        .pulse-circle {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0 auto;
            animation: pulse 2s infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        .status-text {
            color: #666;
            font-size: 1.1rem;
            line-height: 1.6;
            margin: 1rem 0;
        }
        
        .session-info {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 1rem;
            margin: 2rem 0;
            text-align: left;
        }
        
        .session-info h3 {
            color: #333;
            margin-bottom: 0.5rem;
        }
        
        .session-info p {
            color: #666;
            margin: 0.5rem 0;
            font-size: 0.9rem;
        }
        
        .instructions {
            background: #e7f3ff;
            border: 1px solid #b6d7ff;
            border-radius: 8px;
            padding: 1rem;
            margin: 2rem 0;
            color: #004085;
        }
        
        .instructions h3 {
            margin-bottom: 0.5rem;
        }
        
        .instructions ul {
            text-align: left;
            margin-left: 1rem;
        }
        
        .instructions li {
            margin: 0.5rem 0;
        }
        
        .back-button {
            display: inline-block;
            padding: 12px 24px;
            background: #6c757d;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin-top: 1rem;
            transition: all 0.3s ease;
        }
        
        .back-button:hover {
            background: #5a6268;
            transform: translateY(-2px);
        }
        
        .error-container {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 8px;
            padding: 2rem;
            color: #721c24;
        }
    </style>
</head>
<body>
    <?php if (isset($error)): ?>
        <div class="waiting-container">
            <div class="error-container">
                <h1>❌ Error</h1>
                <p><?= htmlspecialchars($error) ?></p>
                <a href="index.html" class="back-button">← Back to Login</a>
            </div>
        </div>
    <?php else: ?>
        <div class="waiting-container">
            <div class="waiting-header">
                <h1>⏳ Request Sent!</h1>
            </div>
            
            <div class="waiting-animation">
                <div class="pulse-circle">💬</div>
            </div>
            
            <div class="status-text">
                Your chat request has been sent to Amir.<br>
                Please wait for the secure chat link...
            </div>
            
            <div class="session-info">
                <h3>📋 Session Details:</h3>
                <p><strong>Name:</strong> <?= htmlspecialchars($sessionData['name']) ?></p>
                <p><strong>Email:</strong> <?= htmlspecialchars($sessionData['email']) ?></p>
                <?php if ($sessionData['telegram']): ?>
                    <p><strong>Telegram:</strong> <?= htmlspecialchars($sessionData['telegram']) ?></p>
                <?php endif; ?>
                <p><strong>Subject:</strong> <?= htmlspecialchars($sessionData['subject']) ?></p>
                <p><strong>Session ID:</strong> <code><?= htmlspecialchars($sessionId) ?></code></p>
                <p><strong>Created:</strong> <?= date('Y-m-d H:i:s', $sessionData['created_at']) ?></p>
            </div>
            
            <div class="instructions">
                <h3>📱 Next Steps:</h3>
                <ul>
                    <li>Amir has received your chat request</li>
                    <li>You will receive a secure chat link via Telegram or email</li>
                    <li>The link will be valid for 24 hours</li>
                    <li>Click the link to start your private conversation</li>
                    <li>Keep this page open to check for updates</li>
                </ul>
            </div>
            
            <a href="index.html" class="back-button">← Request Another Session</a>
        </div>
        
        <script>
            // Auto-refresh page every 30 seconds to check for updates
            setTimeout(function() {
                location.reload();
            }, 30000);
            
            // Show time elapsed
            const startTime = <?= $sessionData['created_at'] * 1000 ?>;
            
            function updateElapsed() {
                const now = Date.now();
                const elapsed = Math.floor((now - startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                
                const elapsedText = minutes > 0 
                    ? `${minutes}m ${seconds}s` 
                    : `${seconds}s`;
                
                document.title = `⏳ Waiting (${elapsedText}) - Chat Request`;
            }
            
            updateElapsed();
            setInterval(updateElapsed, 1000);
        </script>
    <?php endif; ?>
</body>
</html>
