# � Telegram Integration Setup (GitHub Pages Compatible)

This setup works directly from GitHub Pages without needing an external server!

## � Quick Setup (2 Steps Only!)

### Step 1: Get Your Chat ID
1. Start a conversation with your bot by searching for it on Telegram
2. Send any message to your bot (like "Hello")
3. Open this link in your browser: 
   ```
   https://api.telegram.org/bot7563475603:AAH-bhTQky3DLzTAdA-V3MzzbU2p9zRx6eM/getUpdates
   ```
4. Look for `"chat":{"id":` and copy the number (example: `123456789`)

### Step 2: Update Your Code
1. Open `telegram-form.js` file
2. Find this line: `this.CHAT_ID = '1234567890';`
3. Replace `1234567890` with your actual chat ID from step 1
4. Save and commit the changes

## ✅ That's it! 

Your form will now send messages directly to your Telegram chat.

## 🔍 Example Chat ID Format

If the API response looks like this:
```json
{
  "ok": true,
  "result": [
    {
      "update_id": 123456,
      "message": {
        "message_id": 1,
        "from": {...},
        "chat": {
          "id": 987654321,
          "first_name": "Your Name",
          "type": "private"
        },
        "text": "Hello"
      }
    }
  ]
}
```

Your Chat ID is: `987654321`

## 🛠️ Troubleshooting

**Form not working?**
- Make sure you've updated the Chat ID in `telegram-form.js`
- Check browser console for error messages
- Ensure you've sent at least one message to your bot

**Bot not responding?**
- Make sure you've started a conversation with your bot first
- The bot token is already configured correctly

**CORS errors?**
- The form will automatically try alternative delivery methods
- This is normal for direct API calls from browsers

## 🔒 Security Note

The bot token is visible in the source code. This is acceptable for personal use, but for production applications, consider using a relay server to keep the token private.

---

✨ **Your bot is ready to receive messages from your website!**

Need help? Contact: amirshirkhodaeetari@gmail.com
