# Amir Shirkhodaee - Social Media Links Website

A personal website to showcase Amir Shirkhodaee's social media profiles with a clean and modern design.

## Included Social Media Links

- Telegram Channel: https://t.me/mafolieee
- Telegram Stickers: https://t.me/amshstickers
- Portfolio: https://amsh23.github.io/my-portfolio/
- Instagram: https://www.instagram.com/am_.shi
- LinkedIn: https://www.linkedin.com/in/amir-shirkhodaee
- GitHub: https://github.com/Amsh23
- Twitter (X): https://x.com/AmShiii2003
- Donate (PayPal): https://www.paypal.com/paypalme/amir8761
- Discord: https://discord.gg/u3tNfmhu
- Buy Me A Coffee: https://coff.ee/amir7657
- Kick: https://kick.com/velvetkisss
- Trovo: https://trovo.live/s/VelvetKisss
- Twitch: https://www.twitch.tv/alphareturn10
- YouTube: https://www.youtube.com/@VelvetKissss

## Features

- Responsive design that works on desktop and mobile devices
- Beautiful animations for a professional look
- Easy to customize with your own information and links
- Optimized for fast loading
- Embedded Spotify podcast player
- Photo gallery with lightbox functionality and "Load More" feature
- Video player for MP4 files
- Real-time chat integration

## How to Use

1. Edit the `index.html` file to:
   - Change the title and description
   - Add your name and personal details
   - Add or remove social media links as needed

2. Customize the styles in `styles.css` to match your preferred color scheme

3. If you want to add a profile picture, replace the icon in the HTML with an image tag:
   ```html
   <div class="profile-image">
       <img src="your-image.jpg" alt="Profile Picture">
   </div>
   ```

## How to Deploy on Render

1. Create a Render account at [render.com](https://render.com/)

2. Create a new Static Site:
   - Connect your GitHub repository (you'll need to push this code to GitHub first)
   - Set the build command to: `# no build command needed`
   - Set the publish directory to: `.` (the root of your project)

3. Click "Create Static Site"

4. Your site will be deployed with a URL like: `https://your-site-name.onrender.com`

## Adding More Social Media Links

To add more social media links, copy and paste the existing link structure in the HTML and modify it:

```html
<a href="YOUR_LINK_HERE" class="social-link PLATFORM_NAME" target="_blank">
    <i class="fab fa-PLATFORM_ICON"></i>
    <span>PLATFORM_NAME</span>
</a>
```

Then add a corresponding style in the CSS file to give it the appropriate color.
