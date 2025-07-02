# 🚀 Telegram Integration Deployment Guide

This guide will help you deploy the Telegram relay server and update your website to send messages.

## 📋 Quick Setup Checklist

### Step 1: Create Telegram Bot
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` command
3. Choose a name and username for your bot
4. Copy the bot token (looks like: `123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

### Step 2: Get Your Chat ID
1. Start a conversation with your bot (send any message)
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Look for `"chat":{"id":` in the response
4. Copy the chat ID (example: `123456789`)

### Step 3: Deploy Server to Railway
1. Create account at [Railway.app](https://railway.app/)
2. Click "Deploy from GitHub repo"
3. Connect your GitHub account and select the `telegram-relay-server` repository
4. Set environment variables in Railway dashboard:
   - `BOT_TOKEN` = your bot token from step 1
   - `CHAT_ID` = your chat ID from step 2
5. Deploy and copy the generated URL (example: `https://your-app.railway.app`)

### Step 4: Update Website
1. Open `telegram-form.js` file
2. Find line: `this.API_URL = 'https://your-railway-server.railway.app/send';`
3. Replace with your Railway URL: `this.API_URL = 'https://your-app.railway.app/send';`
4. Commit and push changes to GitHub

### Step 5: Test
1. Visit your GitHub Pages site
2. Scroll to "Send me a Message" section
3. Type a test message and click "Send to Telegram"
4. Check your Telegram to see if the message arrived

## 🔧 Alternative Deployment Options

### Render.com
1. Connect GitHub repo to Render
2. Set environment variables in dashboard
3. Deploy and get URL

### Cloudflare Workers
1. Install Wrangler CLI: `npm install -g wrangler`
2. Set secrets: `wrangler secret put BOT_TOKEN` and `wrangler secret put CHAT_ID`
3. Deploy: `wrangler publish`

## 🛠️ Troubleshooting

### Form not appearing?
- Check that `telegram-form.js` is loaded in `index.html`
- Check browser console for JavaScript errors

### Messages not sending?
- Verify API URL in `telegram-form.js` matches your deployed server
- Check server logs for errors
- Verify bot token and chat ID are correct

### Bot not responding?
- Make sure you've started a conversation with your bot
- Check that the chat ID is correct (positive number for users, negative for groups)

## 📱 How it Works

```
Website Form → Your Server → Telegram Bot API → Your Telegram Chat
```

Your bot token stays secure on your server and never gets exposed to the website visitors.

## 🔒 Security Notes

- Bot token is never exposed to frontend users
- Server validates all input before sending to Telegram
- Messages are limited to 500 characters
- CORS is configured to accept requests from your domain

---

Need help? Contact: amirshirkhodaeetari@gmail.com
