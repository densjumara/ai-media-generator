# Public Assets

This folder contains frontend assets (CSS, JavaScript, images, etc.).

## Structure

```
/public
├── index.html              ← Main web application
├── assets/
│   ├── css/               ← Stylesheets
│   ├── js/                ← JavaScript files
│   └── images/            ← Images and icons
└── uploads/               ← Uploaded files
```

## CSS Files

Store stylesheets in `assets/css/`:
- `style.css` - Main styles
- `responsive.css` - Mobile styles
- `dark-theme.css` - Theme styles

## JavaScript Files

Store JavaScript in `assets/js/`:
- `app.js` - Main app logic
- `api.js` - API client
- `ui.js` - UI interactions

## Images

Store images in `assets/images/`:
- `logo.png`
- `icons/`
- `backgrounds/`

## Serving Files

Files in `/public` are served as static content. Access them:
```
http://localhost:5000/assets/css/style.css
http://localhost:5000/assets/images/logo.png
```
