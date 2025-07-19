<?php
/*
==============================================================================
                    PASSWORD PROTECTION SYSTEM
                    Copyright © 2025 Amir Shirkhodaee
==============================================================================
*/

session_start();

define('CORRECT_PASSWORD', 'meow');

function requirePassword() {
    // Check if already authenticated in this session
    if (isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true) {
        return true;
    }
    
    // Check if password is provided via POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
        if ($_POST['password'] === CORRECT_PASSWORD) {
            $_SESSION['authenticated'] = true;
            return true;
        } else {
            return false;
        }
    }
    
    // Show password form
    showPasswordForm();
    exit;
}

function showPasswordForm($error = '') {
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🔒 Access Protected</title>
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
            
            .auth-container {
                background: white;
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: 400px;
                margin: 20px;
                text-align: center;
            }
            
            .auth-header {
                margin-bottom: 2rem;
            }
            
            .auth-header h1 {
                color: #333;
                margin-bottom: 0.5rem;
                font-size: 2rem;
            }
            
            .auth-header p {
                color: #666;
                font-size: 1rem;
            }
            
            .form-group {
                margin-bottom: 1.5rem;
                text-align: left;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                color: #333;
                font-weight: 500;
            }
            
            .form-group input {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e1e1e1;
                border-radius: 8px;
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            
            .form-group input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            .submit-btn {
                width: 100%;
                padding: 12px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
            }
            
            .error-message {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
                border-radius: 5px;
                padding: 10px;
                margin-bottom: 1rem;
            }
            
            .warning-box {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1.5rem;
                color: #856404;
                font-size: 0.9rem;
            }
        </style>
    </head>
    <body>
        <div class="auth-container">
            <div class="auth-header">
                <h1>🔒 Protected Area</h1>
                <p>This page is password protected</p>
            </div>
            
            <div class="warning-box">
                ⚠️ <strong>Authorized Access Only</strong><br>
                This area contains sensitive chat functionality and requires authentication.
            </div>
            
            <?php if ($error): ?>
                <div class="error-message">
                    ❌ <?= htmlspecialchars($error) ?>
                </div>
            <?php endif; ?>
            
            <form method="POST" action="">
                <div class="form-group">
                    <label for="password">🔑 Access Password</label>
                    <input type="password" id="password" name="password" required 
                           placeholder="Enter the access password" autofocus>
                </div>
                
                <button type="submit" class="submit-btn">
                    🚪 Enter Protected Area
                </button>
            </form>
        </div>
        
        <script>
            // Auto-focus password field
            document.getElementById('password').focus();
            
            // Handle form submission with feedback
            document.querySelector('form').addEventListener('submit', function(e) {
                const password = document.getElementById('password').value;
                if (!password.trim()) {
                    e.preventDefault();
                    alert('Please enter the password');
                    return false;
                }
                
                // Show loading state
                const btn = document.querySelector('.submit-btn');
                btn.disabled = true;
                btn.innerHTML = '🔄 Verifying...';
            });
        </script>
    </body>
    </html>
    <?php
}

function checkPassword() {
    if (!requirePassword()) {
        showPasswordForm('Incorrect password. Access denied.');
        exit;
    }
}
?>
