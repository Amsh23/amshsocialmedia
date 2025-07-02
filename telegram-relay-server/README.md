# 🤖 Telegram Relay Server

A secure Node.js Express server that acts as a relay between static websites (like GitHub Pages) and Telegram Bot API. This server ensures your bot token remains private while allowing your static site to send messages to Telegram.

## ✨ Features

- 🔐 **Secure**: Bot token never exposed to frontend
- 🚀 **Fast**: Lightweight Express.js server
- 🌐 **CORS Ready**: Works with any static site
- ⚡ **Deploy Anywhere**: Railway, Render, Cloudflare Workers
- 📝 **Validated**: Input validation and error handling
- 🛡️ **Protected**: Rate limiting and security headers

## 🚀 Quick Start

### Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd telegram-relay-server
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values:
   # BOT_TOKEN=your_bot_token_from_botfather
   # CHAT_ID=your_telegram_chat_id
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Test the server:**
   ```bash
   curl -X POST http://localhost:3000/send \
     -H "Content-Type: application/json" \
     -d '{"message":"Hello from your website!"}'
   ```

### Getting Your Bot Token and Chat ID

1. **Create a Telegram Bot:**
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Use `/newbot` command and follow instructions
   - Copy your bot token

2. **Get Your Chat ID:**
   - Message [@userinfobot](https://t.me/userinfobot) on Telegram
   - It will reply with your chat ID
   - Or start a chat with your bot and use this URL: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`

## 🌐 Deployment

### Railway
1. Connect your GitHub repo to Railway
2. Set environment variables in Railway dashboard:
   - `BOT_TOKEN`
   - `CHAT_ID`
3. Deploy automatically

### Render
1. Connect your GitHub repo to Render
2. Set environment variables in Render dashboard
3. Deploy with auto-deploy enabled

### Cloudflare Workers
1. Install Wrangler CLI: `npm install -g wrangler`
2. Login: `wrangler login`
3. Set secrets: 
   ```bash
   wrangler secret put BOT_TOKEN
   wrangler secret put CHAT_ID
   ```
4. Deploy: `wrangler publish`

## 📡 API Endpoints

### `POST /send`
Send a message to your Telegram bot.

**Request:**
```json
{
  "message": "Your message text here"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Message sent successfully to Telegram",
  "timestamp": "2025-07-02T10:30:00.000Z"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Message is required and must be a non-empty string"
}
```

### `GET /`
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "Telegram Relay Server is running",
  "version": "1.0.0",
  "timestamp": "2025-07-02T10:30:00.000Z"
}
```

## 🔧 Frontend Integration

Add this to your HTML page:

```html
<script>
async function sendToTelegram(message) {
  try {
    const response = await fetch('https://your-deployed-server.com/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    const result = await response.json();
    if (result.success) {
      alert('✅ Message sent successfully!');
    } else {
      alert('❌ Failed to send message');
    }
  } catch (error) {
    alert('❌ Network error');
  }
}
</script>
```

## 🛡️ Security

- **Never commit `.env` files** - they contain sensitive tokens
- **Use HTTPS** for production deployments
- **Validate input** - server validates all incoming messages
- **Rate limiting** - consider adding rate limiting for production use

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BOT_TOKEN` | Yes | Your Telegram bot token from @BotFather |
| `CHAT_ID` | Yes | Your Telegram chat ID |
| `PORT` | No | Server port (default: 3000) |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Amir Shirkhodaee**
- GitHub: [@Amsh23](https://github.com/Amsh23)
- Email: amirshirkhodaeetari@gmail.com

---

⭐ If this project helped you, please give it a star on GitHub!
