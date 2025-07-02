# 🤖 Telegram Deep Link Bot

A powerful Telegram bot with deep linking support to track user sources and provide personalized welcome messages.

## ✨ Features

- 🔗 **Deep Linking**: Track users from different sources using start parameters
- 📊 **Analytics**: Built-in visitor tracking and source statistics
- 💬 **Custom Messages**: Personalized welcome messages based on source
- 🛡️ **Secure**: Token stored in environment variables
- 📝 **Logging**: CSV format logs for easy analysis
- 🎯 **Inline Keyboards**: Interactive buttons for better UX

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file with your bot token:
```env
BOT_TOKEN=your_telegram_bot_token_here
BOT_USERNAME=your_bot_username
```

### 3. Run the Bot
```bash
npm start
```

## 🔗 Deep Link Examples

### Basic Usage
- **Direct access**: `https://t.me/amshsocialbot`
- **Website traffic**: `https://t.me/amshsocialbot?start=website`
- **GitHub visitors**: `https://t.me/amshsocialbot?start=github`
- **Custom source**: `https://t.me/amshsocialbot?start=fromsite_123`

### Integration with Your Website
Add these links to your website:

```html
<!-- Basic Telegram link -->
<a href="https://t.me/amshsocialbot?start=website">
  Contact me on Telegram
</a>

<!-- From specific page -->
<a href="https://t.me/amshsocialbot?start=homepage">
  Contact from Homepage
</a>

<!-- From social media -->
<a href="https://t.me/amshsocialbot?start=instagram">
  From Instagram
</a>
```

## 📊 Source Tracking

The bot automatically tracks:
- User ID (for uniqueness)
- Username (if available)
- First name
- Source parameter
- Timestamp

All data is stored in `user_visits.log` file in CSV format.

## 💬 Custom Welcome Messages

### Predefined Sources
- `website` → Custom website welcome
- `github` → Developer-focused message
- `instagram` → Social media message
- `telegram_channel` → Channel subscriber message
- `fromsite_123` → Special custom message

### Default Message
For users without parameters or unknown sources:
```
سلام [نام]! 🌟
خوش اومدی به ربات ما
```

### Custom Source Example
For `?start=fromsite_123`:
```
سلام [نام] 🌟
شما از منبع `fromsite_123` وارد شدید!
خوش آمدید.
```

## 🛠️ Bot Commands

- `/start` - Start bot (supports parameters)
- **Stats Button** - View visitor statistics
- **Help Button** - Show usage guide
- **Website Button** - Link to your website

## 📈 Analytics Dashboard

The bot provides built-in analytics accessible via the "📊 آمار بازدید" button:

- Total visitor count
- Source breakdown with percentages
- Most popular traffic sources
- Real-time statistics

## 🔧 Configuration

### Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `BOT_TOKEN` | Yes | Your Telegram bot token from @BotFather |
| `BOT_USERNAME` | Optional | Your bot username for reference |

### Custom Messages
Edit the `sourceMessages` object in `bot.js` to add your own custom welcome messages:

```javascript
const sourceMessages = {
    'your_source': `Custom message for your source`,
    'special_promo': `Special promotion message`,
    // Add more sources here...
};
```

## 📁 File Structure

```
telegram-deeplink-bot/
├── bot.js              # Main bot code
├── package.json        # Dependencies and scripts
├── .env               # Environment variables (create this)
├── .gitignore         # Git ignore rules
├── README.md          # This file
└── user_visits.log    # Auto-generated visitor log
```

## 🛡️ Security

- ✅ Bot token stored in environment variables
- ✅ User data logging is minimal and secure
- ✅ No sensitive information in logs
- ✅ Input validation for all parameters
- ❌ Never commit `.env` file to Git

## 🚀 Deployment

### Local Development
```bash
git clone <repository>
cd telegram-deeplink-bot
npm install
# Create .env file with your BOT_TOKEN
npm start
```

### Production Deployment
1. **Heroku**: Connect GitHub repo and set environment variables
2. **Railway**: Deploy from GitHub with environment configuration
3. **VPS**: Clone repo, install dependencies, run with PM2

### PM2 Deployment (VPS)
```bash
npm install -g pm2
pm2 start bot.js --name telegram-bot
pm2 save
pm2 startup
```

## 📊 Log Analysis

The `user_visits.log` file can be imported into Excel, Google Sheets, or analyzed with:

```bash
# Count unique visitors
cut -d',' -f2 user_visits.log | sort | uniq | wc -l

# Most popular sources
cut -d',' -f5 user_visits.log | sort | uniq -c | sort -nr
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Amir Shirkhodaee**
- GitHub: [@Amsh23](https://github.com/Amsh23)
- Email: amirshirkhodaeetari@gmail.com
- Telegram: [Contact via website](https://amsh23.github.io/amshsocialmedia/)

## 🆘 Support

If you need help:
1. Check the troubleshooting section
2. Look at existing [GitHub Issues](../../issues)
3. Create a new issue with detailed description
4. Contact via email for urgent matters

---

⭐ **If this project helped you, please give it a star on GitHub!**

## 🔍 Troubleshooting

### Bot not responding?
- Check if bot token is correct in `.env`
- Verify the bot is running: `npm start`
- Check console for error messages

### Deep links not working?
- Make sure bot username is correct in links
- Test with simple `/start` command first
- Check if parameters are properly formatted

### Logging issues?
- Verify write permissions in bot directory
- Check if `user_visits.log` is created automatically
- Look for error messages in console

### Analytics not showing?
- Ensure some users have visited the bot
- Check if log file contains data
- Restart bot if statistics seem stuck
