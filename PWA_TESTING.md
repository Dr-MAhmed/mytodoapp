# PWA Testing & Deployment Guide

## Development Testing

### Quick Start

```bash
# Install dependencies
pnpm install

# Build the application
pnpm build

# Preview production build locally
pnpm preview
```

### Test Offline Mode

1. **Using Browser DevTools:**
   - Open DevTools (F12 or right-click → Inspect)
   - Go to "Network" tab
   - Check "Offline" checkbox
   - Reload the page
   - App should work perfectly without internet

2. **Simulating Slow Network:**
   - DevTools → Network tab
   - Select "Slow 3G" from dropdown
   - Works great for testing caching behavior

3. **Clear Service Worker Cache:**
   - DevTools → Application → Service Workers
   - Click "Unregister" to clear the worker
   - Or: Clear "public\sw.js" changes

### Test Installation

#### Google Chrome / Edge (Windows/Mac/Linux)
1. Visit `http://localhost:5173` (or production URL)
2. Look for install icon in address bar
3. Or: Menu ≫ "Install Todify"
4. Confirm installation
5. App opens in standalone window

#### Android Chrome
1. Visit app on your Android phone
2. Tap "Install App" button in the header
3. Confirm the installation dialog
4. App appears on home screen and app drawer
5. Tap to launch in fullscreen mode

#### iOS Safari
1. Visit app in Safari on iPhone/iPad
2. Tap the Share button (⬆️)
3. Scroll down → "Add to Home Screen"
4. Name the app (default: "Todify")
5. Tap "Add"
6. Find app on home screen

### Test Service Worker

1. **Check Service Worker Status:**
   - DevTools → Application → Service Workers
   - Should show "active and running"

2. **View Cached Files:**
   - DevTools → Application → Cache Storage
   - Select "todify-v1" cache
   - View all cached assets

3. **Test Cache Updates:**
   - DevTools → Application → Cache Storage
   - Right-click → Delete
   - Reload page
   - New cache will be created automatically

4. **Monitor Network Requests:**
   - DevTools → Network
   - Online mode: See network requests
   - Offline mode: See (cached) or (from ServiceWorker)

### Test Manifest

1. **Validate Manifest:**
   - DevTools → Application → Manifest
   - Check all fields are correct
   - Click "Add to shelf" to test install

2. **Verify Icons:**
   - Icons should display correctly
   - Check different sizes (192x192, 512x512)
   - Verify maskable icons render properly

## Deployment Checklist

### Before Deployment

- [ ] Replace `public/favicon.png` with your app icon
  - ✨ Requirement: 512x512 PNG minimum
  - ✨ Recommended: Also create 192x192 version
  - ✨ Pro tip: Use both regular and maskable variants

- [ ] Update app metadata in `public/manifest.json`
  - [ ] `name`: Full app name
  - [ ] `short_name`: Name for home screen (12 chars max)
  - [ ] `description`: What the app does
  - [ ] `theme_color`: Header color
  - [ ] `background_color`: Splash screen color

- [ ] Update colors in `vite.config.ts`
  - [ ] `theme_color`
  - [ ] `background_color`

- [ ] Update HTML meta tags in `index.html`
  - [ ] `theme-color`
  - [ ] `description`
  - [ ] `apple-mobile-web-app-title`

- [ ] Verify HTTPS is enabled
  - ✨ PWA requires HTTPS in production
  - ✨ Localhost works without HTTPS for testing

- [ ] Test on multiple devices
  - [ ] Android phone/tablet
  - [ ] iPhone/iPad
  - [ ] Windows desktop
  - [ ] Mac
  - [ ] Linux

### Deployment Steps

#### Option 1: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Preview deployment
vercel --prod
```

#### Option 2: Netlify

```bash
# Connect via web dashboard
# Or use CLI:
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Option 3: GitHub Pages

```bash
# Update vite.config.ts with base path if needed
# Build and push to gh-pages branch
```

#### Option 4: Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Post-Deployment Testing

1. **Test Installation from Production**
   - Visit your live URL
   - Test install button on different devices
   - Verify app icon displays correctly

2. **Test Offline on Production**
   - Open DevTools → Network
   - Go offline
   - All functionality should work

3. **Check Security Headers**
   ```bash
   # Recommended headers:
   # - Content-Security-Policy
   # - X-Content-Type-Options: nosniff
   # - X-Frame-Options: DENY
   # - Referrer-Policy: no-referrer
   ```

4. **Lighthouse Audit**
   - DevTools → Lighthouse
   - Run PWA audit
   - Target: All green ✅

## Performance Optimization

### Cache Strategy Tuning

Edit `public/sw.js` to adjust caching:

```javascript
// Increase cache size
const MAX_CACHE_ENTRIES = 200;

// Adjust cache expiration
expiration: {
  maxEntries: 200,        // More cached files
  maxAgeSeconds: 2592000  // 30 days
}
```

### Asset Optimization

1. **Compress Images**
   ```bash
   # Using ImageOptim or similar tool
   # Reduce PNG/JPG file sizes
   ```

2. **Minify Code**
   - Already done by Vite during build

3. **Code Splitting**
   - Already configured in Vite

### Network Optimization

1. **Check Network Panel**
   ```bash
   pnpm build
   pnpm preview
   # Check DevTools → Network for file sizes
   ```

2. **Enable Compression**
   - Most hosting providers do this automatically
   - Verify in Response Headers: `Content-Encoding: gzip`

## Monitoring & Analytics

### Recommended Tools

1. **Sentry** (Error tracking)
   - Monitor JavaScript errors in production
   - Track service worker issues

2. **Google Analytics**
   - Track app installations
   - Monitor offline usage patterns

3. **Lighthouse CI**
   - Automated performance monitoring
   - Run after each deployment

4. **Firebase/Amplitude**
   - Track user engagement
   - Monitor app usage metrics

## Common Issues & Solutions

### Issue: Install button not showing

**Solution:**
- On desktop: Only shows on Chrome/Edge/Opera
- On mobile: Check HTTPS is enabled
- Clear cache and hard refresh (Ctrl+Shift+R)
- Check manifest is valid

### Issue: Service worker not installing

**Solution:**
- Check console for errors (F12)
- Verify `public/sw.js` is accessible
- Check DevTools → Application → Service Workers
- Hard refresh the page

### Issue: Offline features not working

**Solution:**
- Check service worker status (DevTools → Application)
- Verify network request shows "(cached)" in offline mode
- Check IndexedDB for data (some apps use this)
- Look at sw.js fetch handler implementation

### Issue: App not updating

**Solution:**
- Service workers cache aggressively
- Users need to close and reopen app
- Auto-update is configured (registerType: "autoUpdate")
- Clear cache if users report old version

## Verification Checklist

Run the verification script:

```bash
# Windows
check-pwa-setup.bat

# macOS/Linux
bash check-pwa-setup.sh
```

All checks should pass ✅

## Resources

- [MDN PWA Documentation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google Web.dev PWA](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin Docs](https://vite-plugin-pwa.netlify.app/)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## Support

Having issues? Check:
1. Browser console for error messages (F12)
2. Service Worker console (DevTools → Application → Service Workers)
3. Network tab to see what's being cached
4. PWA_SETUP.md for more detailed setup info
