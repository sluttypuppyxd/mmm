# Personal Portfolio / Bio Link Site

A modern, beautiful portfolio and bio link site inspired by guns.lol. Perfect for showcasing your personal information, social links, and projects.

## Features

- 🎨 Modern, clean design with smooth animations
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔗 Customizable social links
- 💼 Project showcase section
- ⚡ Fast and lightweight
- 🌙 Dark theme optimized
- ✨ Smooth hover effects and transitions
- ⚙️ **Password-protected admin settings page**
- 💾 **Automatic data persistence with localStorage**
- 🎨 **Customizable accent colors**

## Admin Settings

Access the settings page at `settings.html` to easily edit your profile:

1. **Default Password**: `admin123` (⚠️ **Change this in `settings.js`!**)
2. Click the gear icon (⚙️) in the bottom-right corner of your profile page
3. Or navigate directly to `settings.html`

### Settings Features:
- ✏️ Edit avatar, username, bio, and location
- 🎨 Change accent color with visual color picker
- 🔗 Add/remove/edit social links
- 🚀 Add/remove/edit featured projects
- 💾 All changes save automatically to localStorage
- ✅ Real-time URL validation

## Customization

### Option 1: Using the Settings Page (Recommended)

Just use the admin settings page - it's much easier! See above.

### Option 2: Manual Editing

Edit `index.html` to update your personal details:

```html
<h1 class="name">Your Name</h1>
<p class="bio">Your bio or tagline goes here. Keep it short and impactful.</p>
<p class="location">📍 Location</p>
```

### 2. Avatar Image

Replace the avatar div with your own image:

```html
<div class="avatar" style="background-image: url('path/to/your/image.jpg'); background-size: cover;"></div>
```

Or keep the gradient style and customize colors in `styles.css`:

```css
.avatar {
    background: linear-gradient(135deg, #your-color, #another-color);
}
```

### 3. Social Links

Update the links in `index.html`:

```html
<a href="https://your-portfolio.com" class="link-card" target="_blank">
    <span class="link-icon">🌐</span>
    <span class="link-text">Portfolio</span>
    <span class="link-arrow">→</span>
</a>
```

Change:
- `href`: Your actual URL
- `link-icon`: Emoji or icon
- `link-text`: Display text

### 4. Projects

Update the project cards:

```html
<div class="project-card">
    <div class="project-icon">🚀</div>
    <h3 class="project-title">Project One</h3>
    <p class="project-description">Brief description of your project here.</p>
    <a href="https://project-url.com" class="project-link" target="_blank">View Project →</a>
</div>
```

### 5. Colors & Theme

Customize colors in `styles.css`:

```css
:root {
    --bg-color: #0a0a0a;          /* Background color */
    --card-bg: #1a1a1a;           /* Card background */
    --accent: #6366f1;            /* Accent color (links, borders) */
    --text-primary: #ffffff;      /* Primary text */
    --text-secondary: #a0a0a0;    /* Secondary text */
}
```

### 6. Fonts

Change the font in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
```

And update in `styles.css`:

```css
font-family: 'YourFont', sans-serif;
```

## Deployment

### Option 1: GitHub Pages

1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select your branch and save
4. Your site will be live at `https://username.github.io/repository-name`

### Option 2: Netlify

1. Visit [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Your site is instantly live!

### Option 3: Vercel

1. Visit [vercel.com](https://vercel.com)
2. Import your repository
3. Deploy with one click

### Option 4: Any Web Hosting

Upload all files to your web hosting provider via FTP or their file manager.

## File Structure

```
site/
├── index.html      # Main portfolio page
├── settings.html   # Admin settings page
├── styles.css      # Portfolio styling
├── settings.css    # Settings page styling
├── script.js       # Portfolio JavaScript
├── settings.js     # Settings page JavaScript
└── README.md       # This file
```

## Security Note

⚠️ **Important**: The settings page uses a simple password stored in `settings.js`. For production use:
1. Change the default password in `settings.js` (line 4: `DEFAULT_PASSWORD`)
2. Consider adding more robust authentication
3. The password is stored in plain text - this is fine for personal use but not for production

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Tips

- Keep your bio short and impactful
- Use high-quality images for projects
- Test all links before deploying
- Consider adding your own favicon
- Update the footer copyright year

## License

Free to use for personal and commercial projects.

---

Made with ❤️ for personal portfolios

