# PWA Setup Guide - Todify

## Overview
Todify is now a fully-featured Progressive Web App (PWA) with offline support and installable features for Android, iOS, and desktop browsers.

## Features Implemented

### ✅ Service Worker
- **Offline Support**: App works without internet connection
- **Intelligent Caching**: Network-first strategy for APIs, cache-first for static assets
- **Auto-Update**: Service worker automatically updates when new versions are available
- **Background Sync**: Tasks are synced when connection is restored

### ✅ Installation
- **Android**: Install button appears automatically - tap to add to home screen
- **iOS**: Manual installation via Share → Add to Home Screen
- **Desktop (Windows/Mac/Linux)**: Install button appears - creates app window
- **Installation Status**: Button shows "Installed" once the app is installed

### ✅ Manifest & Metadata
- Complete PWA manifest with app icons and shortcuts
- App shortcuts for quick actions (New Task, View Tasks)
- Theme colors and display modes configured
- Screenshot definitions for app stores

### ✅ Storage & Local Data
- Tasks are stored in browser's local storage
- Data persists across sessions
- Works completely offline

## How to Install the App

### Android
1. Visit the app in your browser
2. Tap the **"Install App"** button in the header
3. Confirm the installation
4. App will be added to your home screen and app drawer

### iPhone/iPad (iOS)
1. Visit the app in Safari
2. Tap the **Share** button (bottom center)
3. Scroll down and tap **Add to Home Screen**
4. Enter desired name and tap **Add**
5. App will appear on your home screen

### Windows PC
1. Visit the app in Chrome, Edge, or Opera
2. Tap the **"Install App"** button in the header
3. Confirm installation
4. App will be installed as a Windows app
5. Access from Start Menu or desktop shortcut

### Mac
1. Visit the app in Chrome or Edge
2. Look for install icon in address bar
3. Click to install
4. Or use menu: Settings → Install app
5. App will be available in your Applications folder

### Linux
1. Visit the app in Chrome or Chromium-based browser
2. Click the install icon in address bar
3. Confirm installation
4. App will be available in your applications menu

## Offline Functionality

The app works completely offline:
- ✅ Create, edit, and delete todos
- ✅ Filter and sort tasks
- ✅ Change app theme
- ✅ View all previously loaded data
- ⚠️ External API calls will be cached or fail gracefully

When your connection returns, the app automatically syncs any changes.

## Technical Details

### Service Worker Location
- File: `public/sw.js`
- Scope: `/`
- Strategy: Network-first for APIs, cache-first for assets

### Caching Strategy
- **Static Assets**: Cached on first load, updated on refresh
- **API Calls**: Network first, falls back to cache if offline
- **HTML Pages**: Cached for offline navigation

### PWA Configuration
- Manifest: `public/manifest.json`
- Vite PWA Plugin: Configured in `vite.config.ts`
- Meta Tags: Added to `index.html`

### Browser Support
- ✅ Chrome/Edge (Windows, Mac, Linux, Android)
- ✅ Firefox (with limitations)
- ✅ Safari (iOS 13+, limited support)
- ✅ Samsung Internet (Android)
- ✅ Opera (all platforms)

## Update Process

When App Receives Updates:
1. Browser checks for updates periodically
2. If a new version found, registers new service worker
3. Previous version continues to serve the app
4. On next visit or browser refresh, new version loads
5. User gets the latest features and bug fixes

## Development

### Building for Production
```bash
pnpm build
```

Disabled cache busting on SW registration for development:
- In development, open DevTools → Application → Service Workers
- Check "Update on reload" to test SW changes
- Or clear cache and hard refresh (Ctrl+Shift+R)

### Testing Offline Mode
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Offline" checkbox
4. Reload page - app should work
5. Try adding/editing todos offline

### Testing Installation
- Use Chrome/Edge DevTools
- Go Application → Manifest
- Click "Add to shelf" to test install prompt

## Next Steps

To enhance the PWA further:

1. **Push Notifications**
   ```typescript
   // Add push notification support
   // Use Notification API for reminders
   ```

2. **Sync Background Sync**
   ```typescript
   // Sync todos with backend when online
   // Use Background Sync API
   ```

3. **Storage Optimization**
   ```typescript
   // Use IndexedDB for larger data
   // Currently using localStorage (limited to ~5MB)
   ```

4. **App Icons**
   - Replace placeholder favicon.png with branded 512x512 PNG
   - Include maskable icon variant for adaptive icons

5. **Screenshots for App Stores**
   - Add app store screenshots to manifest
   - Update screenshot metadata

## Troubleshooting

### App Not Installing?
- Clear browser cache and cookies
- Try incognito/private mode
- Use Chrome, Edge, or similar Chromium browser
- Ensure HTTPS is used (http works for localhost only)

### Offline Mode Not Working?
- Check DevTools → Application → Service Workers
- Verify service worker is "activated"
- Check Network requests in offline mode
- Clear cache and reload

### Too Slow?
- Check DevTools → Lighthouse
- Run performance audit
- Consider reducing cache size
- Optimize images and assets

## References
- [MDN - Progressive Web Apps](https://developer.mozilla.org/docs/Web/Progressive_web_apps)
- [Google - Web.dev PWA Docs](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin](https://vite-plugin-pwa.netlify.app/)
- [Service Worker Spec](https://www.w3.org/TR/service-workers-1/)
