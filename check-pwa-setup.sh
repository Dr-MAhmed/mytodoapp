#!/bin/bash

# PWA Setup Verification Checklist
# Run this script to verify all PWA components are in place

echo "🔍 Checking PWA Setup for Todify..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} $2 (File missing: $1)"
        ((CHECKS_FAILED++))
    fi
}

# Function to check if content exists in file
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $3"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} $3"
        ((CHECKS_FAILED++))
    fi
}

echo "📦 File Structure Checks:"
echo "========================"
check_file "public/manifest.json" "Manifest file exists"
check_file "public/sw.js" "Service Worker file exists"
check_file "public/favicon.png" "App icon exists"
check_file "src/hooks/use-pwa-install.ts" "PWA install hook exists"
check_file "src/components/PwaInstallButton.tsx" "PWA install button component exists"
check_file "PWA_SETUP.md" "PWA documentation exists"

echo ""
echo "🔧 Configuration Checks:"
echo "========================"
check_content "vite.config.ts" "VitePWA" "VitePWA plugin configured"
check_content "vite.config.ts" "workbox" "Workbox configuration present"
check_content "vite.config.ts" "display.*standalone" "Standalone display mode configured"
check_content "index.html" "webapp-capable" "PWA meta tags in HTML"
check_content "index.html" "manifest" "Manifest link in HTML"
check_content "src/main.tsx" "serviceWorker.register" "Service Worker registration code"

echo ""
echo "📄 Manifest Validation:"
echo "========================"
check_content "public/manifest.json" "\"name\"" "App name in manifest"
check_content "public/manifest.json" "\"short_name\"" "Short name in manifest"
check_content "public/manifest.json" "\"icons\"" "Icons defined in manifest"
check_content "public/manifest.json" "\"start_url\"" "Start URL in manifest"
check_content "public/manifest.json" "\"display\"" "Display mode in manifest"
check_content "public/manifest.json" "\"categories\"" "Categories in manifest"

echo ""
echo "🎨 UI Component Checks:"
echo "========================"
check_content "src/pages/Dashboard.tsx" "PwaInstallButton" "Install button imported in Dashboard"
check_content "src/pages/Dashboard.tsx" "<PwaInstallButton" "Install button rendered in UI"
check_content "src/components/PwaInstallButton.tsx" "usePwaInstall" "Using PWA install hook"

echo ""
echo "📱 Feature Checklist:"
echo "========================"
check_content "public/sw.js" "install" "Service Worker install event"
check_content "public/sw.js" "activate" "Service Worker activate event"
check_content "public/sw.js" "fetch" "Service Worker fetch event"
check_content "src/hooks/use-pwa-install.ts" "beforeinstallprompt" "Install prompt handler"
check_content "src/hooks/use-pwa-install.ts" "appinstalled" "App installed event handler"

echo ""
echo "📊 Summary:"
echo "========================"
TOTAL=$((CHECKS_PASSED + CHECKS_FAILED))
echo -e "${GREEN}Passed:${NC} $CHECKS_PASSED/$TOTAL"
if [ $CHECKS_FAILED -gt 0 ]; then
    echo -e "${RED}Failed:${NC} $CHECKS_FAILED/$TOTAL"
else
    echo -e "${GREEN}All checks passed! ✨${NC}"
fi

echo ""
echo "🚀 Next Steps:"
echo "========================"
echo "1. Run: pnpm install (if dependencies missing)"
echo "2. Run: pnpm build (to build for production)"
echo "3. Run: pnpm preview (to test production build)"
echo "4. Test offline: DevTools → Network → Offline → Reload"
echo "5. Test install: Look for install button in header"
echo ""
echo "📖 For more info, see: PWA_SETUP.md"
