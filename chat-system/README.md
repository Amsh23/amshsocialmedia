# 💬 Secure Chat System

A professional live chat system with Telegram integration, password protection, and admin panel.

## 🚀 Features

- **User Login System**: Secure session-based chat requests
- **Telegram Integration**: Real-time notifications to your Telegram
- **Live Chat Interface**: Two-way messaging with AJAX polling
- **Admin Panel**: Manage all chat sessions from one place
- **Password Protection**: Secure access to sensitive areas
- **Session Management**: Secure, time-limited chat sessions
- **Message Logging**: All conversations are logged and stored
- **Responsive Design**: Works perfectly on desktop and mobile

## 📁 File Structure

```
chat-system/
├── index.html          # User login form
├── login.php          # Handle login requests
├── waiting.php        # Waiting page after login
├── chat.php           # Live chat interface
├── send_message.php   # Send message endpoint
├── fetch_messages.php # Fetch messages endpoint
├── admin.php          # Admin panel
├── auth.php           # Password protection system
├── config.php         # Configuration settings
├── README.md          # This file
└── data/              # Data storage directory
    ├── sessions/      # Chat sessions
    ├── logs/         # Activity logs
    └── backups/      # Backup files
```

## 🛠️ Installation

### Step 1: Upload Files
Upload all files to your web server. Make sure the `data/` directory has write permissions.

### Step 2: Configure Telegram Bot
1. Create a new bot by messaging [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` command and follow instructions
3. Copy your bot token
4. Get your chat ID by messaging your bot and visiting:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
5. Look for `"chat":{"id":` and copy the number

### Step 3: Update Configuration
Edit `config.php` and update:
```php
define('BOT_TOKEN', 'YOUR_BOT_TOKEN_HERE');
define('CHAT_ID', 'YOUR_CHAT_ID_HERE');
define('CHAT_PASSWORD', 'your_secure_password'); // Change from 'meow'
```

### Step 4: Set File Permissions
```bash
chmod 755 chat-system/
chmod 777 chat-system/data/
chmod 644 chat-system/*.php
chmod 644 chat-system/*.html
```

### Step 5: Test the System
1. Visit `index.html` in your browser
2. Fill out the chat request form
3. Check your Telegram for the notification
4. Visit the chat link to start chatting
5. Access `admin.php` to manage sessions

## 🔐 Security Features

### Password Protection
All sensitive pages are protected with password authentication:
- `chat.php` - Chat interface
- `send_message.php` - Message sending
- `fetch_messages.php` - Message fetching  
- `admin.php` - Admin panel

### Session Security
- Secure 64-character hex session IDs
- Time-limited sessions (24 hours by default)
- IP address logging
- Session validation on every request

### Data Protection
- Input sanitization and validation
- XSS protection
- SQL injection prevention (file-based storage)
- Directory access restrictions via `.htaccess`

## 📱 How It Works

### For Users:
1. **Request Chat**: Fill out the form on `index.html`
2. **Wait**: Get redirected to waiting page with session info
3. **Receive Link**: Admin sends secure chat link via Telegram
4. **Chat**: Use the link to access private chat interface

### For Admin (You):
1. **Get Notification**: Receive new chat requests in Telegram
2. **Admin Panel**: Visit `admin.php` to manage all sessions
3. **Join Chat**: Click "Join Chat" to enter the conversation
4. **Quick Replies**: Send quick messages from admin panel
5. **Close Sessions**: Close sessions when conversation ends

## 🚨 Default Settings

- **Password**: `meow` (⚠️ **Change this immediately!**)
- **Session Timeout**: 24 hours
- **Max Message Length**: 1000 characters
- **Auto-refresh**: Every 3 seconds in chat, 30 seconds in admin panel

## 🔧 Customization

### Change Password Protection
Edit `config.php`:
```php
define('CHAT_PASSWORD', 'your_new_secure_password');
```

### Modify Appearance
Edit CSS in the HTML files to customize colors, fonts, and layout.

### Add Features
- Email notifications alongside Telegram
- Database storage instead of files
- User authentication system
- File upload capabilities
- Chat history export

## 📊 Admin Panel Features

- **Session Overview**: See all chat requests and their status
- **Live Management**: Join active chats instantly
- **Quick Replies**: Send messages without opening full chat
- **Session Control**: Close inactive or completed sessions
- **Real-time Updates**: Auto-refresh every 30 seconds

## 🚨 Troubleshooting

### Common Issues:

**Telegram notifications not working:**
- Verify bot token and chat ID in `config.php`
- Make sure you've started a conversation with your bot
- Check PHP error logs

**Permission errors:**
- Ensure `data/` directory is writable by web server
- Check file permissions: `chmod 777 data/`

**Password not working:**
- Clear browser cookies and sessions
- Verify password in `config.php`
- Check for typos (case-sensitive)

**Chat not loading:**
- Check browser console for JavaScript errors
- Verify session ID in URL
- Ensure all PHP files are uploaded correctly

## 📝 Logs and Monitoring

### Activity Logs
All actions are logged in `data/logs/activity_YYYY-MM-DD.txt`:
- Session creation
- Message sending
- Login attempts
- Errors and warnings

### Session Data
Each session creates two files:
- `{session_id}.json` - Session information
- `{session_id}_messages.json` - Chat messages

## 🔄 Maintenance

### Regular Tasks:
1. **Backup Data**: Copy `data/` directory regularly
2. **Clean Logs**: Remove old log files (auto-cleanup available)
3. **Monitor Sessions**: Close inactive sessions
4. **Update Tokens**: Refresh Telegram bot tokens if needed

### Automated Cleanup:
The system can automatically:
- Close sessions after 24 hours
- Archive old conversations
- Limit log file sizes
- Remove expired sessions

## 📞 Support

For issues or questions:
- **Email**: amirshirkhodaeetari@gmail.com
- **Telegram**: @mafolieee
- **GitHub**: https://github.com/Amsh23

## ⚖️ License

Copyright © 2025 Amir Shirkhodaee - All Rights Reserved

---

**⚠️ IMPORTANT SECURITY NOTICE:**
- Change the default password immediately after installation
- Keep your bot token secret and never share it
- Regularly update the system and monitor for security issues
- Use HTTPS in production environments
