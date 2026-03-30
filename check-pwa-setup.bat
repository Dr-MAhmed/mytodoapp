@echo off
setlocal enabledelayedexpansion

REM PWA Setup Verification Checklist for Windows
REM Run this script to verify all PWA components are in place

echo.
echo PWA Setup Verification for Todify
echo ==================================
echo.

set CHECKS_PASSED=0
set CHECKS_FAILED=0

echo [1/3] Checking file structure...
echo ================================

REM Check files
if exist "public\manifest.json" (
    echo [OK] Manifest file exists
    set /a CHECKS_PASSED+=1
) else (
    echo [FAIL] Manifest file missing (public\manifest.json)
    set /a CHECKS_FAILED+=1
)

if exist "public\sw.js" (
    echo [OK] Service Worker file exists
    set /a CHECKS_PASSED+=1
) else (
    echo [FAIL] Service Worker file missing (public\sw.js)
    set /a CHECKS_FAILED+=1
)

if exist "public\favicon.png" (
    echo [OK] App icon exists
    set /a CHECKS_PASSED+=1
) else (
    echo [FAIL] App icon missing (public\favicon.png)
    set /a CHECKS_FAILED+=1
)

if exist "src\hooks\use-pwa-install.ts" (
    echo [OK] PWA install hook exists
    set /a CHECKS_PASSED+=1
) else (
    echo [FAIL] PWA install hook missing
    set /a CHECKS_FAILED+=1
)

if exist "src\components\PwaInstallButton.tsx" (
    echo [OK] PWA install button component exists
    set /a CHECKS_PASSED+=1
) else (
    echo [FAIL] PWA install button component missing
    set /a CHECKS_FAILED+=1
)

if exist "PWA_SETUP.md" (
    echo [OK] PWA documentation exists
    set /a CHECKS_PASSED+=1
) else (
    echo [FAIL] PWA documentation missing
    set /a CHECKS_FAILED+=1
)

echo.
echo [2/3] Checking key configurations...
echo =====================================

findstr /C:"VitePWA" vite.config.ts > nul
if errorlevel 1 (
    echo [FAIL] VitePWA plugin not found in vite.config.ts
    set /a CHECKS_FAILED+=1
) else (
    echo [OK] VitePWA plugin configured
    set /a CHECKS_PASSED+=1
)

findstr /C:"workbox" vite.config.ts > nul
if errorlevel 1 (
    echo [FAIL] Workbox not configured in vite.config.ts
    set /a CHECKS_FAILED+=1
) else (
    echo [OK] Workbox configuration present
    set /a CHECKS_PASSED+=1
)

findstr /C:"standalone" vite.config.ts > nul
if errorlevel 1 (
    echo [FAIL] Standalone display mode not found
    set /a CHECKS_FAILED+=1
) else (
    echo [OK] Standalone display mode configured
    set /a CHECKS_PASSED+=1
)

findstr /C:"webapp-capable" index.html > nul
if errorlevel 1 (
    echo [FAIL] PWA meta tags missing from index.html
    set /a CHECKS_FAILED+=1
) else (
    echo [OK] PWA meta tags in HTML
    set /a CHECKS_PASSED+=1
)

findstr /C:"manifest" index.html > nul
if errorlevel 1 (
    echo [FAIL] Manifest link missing from index.html
    set /a CHECKS_FAILED+=1
) else (
    echo [OK] Manifest link in HTML
    set /a CHECKS_PASSED+=1
)

findstr /C:"serviceWorker.register" src\main.tsx > nul
if errorlevel 1 (
    echo [FAIL] Service Worker registration not found in main.tsx
    set /a CHECKS_FAILED+=1
) else (
    echo [OK] Service Worker registration code present
    set /a CHECKS_PASSED+=1
)

echo.
echo [3/3] Checking manifest content...
echo ===================================

findstr /C:"Todify" public\manifest.json > nul
if errorlevel 1 (
    echo [FAIL] App name missing in manifest
    set /a CHECKS_FAILED+=1
) else (
    echo [OK] App name in manifest
    set /a CHECKS_PASSED+=1
)

findstr /C:"icons" public\manifest.json > nul
if errorlevel 1 (
    echo [FAIL] Icons not defined in manifest
    set /a CHECKS_FAILED+=1
) else (
    echo [OK] Icons defined in manifest
    set /a CHECKS_PASSED+=1
)

findstr /C:"categories" public\manifest.json > nul
if errorlevel 1 (
    echo [FAIL] Categories missing in manifest
    set /a CHECKS_FAILED+=1
) else (
    echo [OK] Categories in manifest
    set /a CHECKS_PASSED+=1
)

echo.
echo ===============================
echo VERIFICATION SUMMARY
echo ===============================
set /a TOTAL=!CHECKS_PASSED!+!CHECKS_FAILED!
echo Passed: !CHECKS_PASSED! / !TOTAL!
if !CHECKS_FAILED! gtr 0 (
    echo Failed: !CHECKS_FAILED! / !TOTAL!
) else (
    echo All checks passed - PWA is ready!
)

echo.
echo ===============================
echo NEXT STEPS
echo ===============================
echo 1. Run: pnpm install (if needed)
echo 2. Run: pnpm build (to build for production)
echo 3. Run: pnpm preview (to test production build)
echo 4. Test offline: F12 ^> Network ^> Offline ^> Reload
echo 5. Test install: Look for "Install App" button
echo.
echo For detailed info, see: PWA_SETUP.md
echo.

pause
