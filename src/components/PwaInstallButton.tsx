import React from 'react';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle2, Wifi, WifiOff } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const PwaInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIos, handleInstall } = usePwaInstall();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show if already installed
  if (isInstalled) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-xs font-semibold text-green-600 dark:text-green-400">
            Downloaded
          </span>
        </div>
        {isOnline ? (
          <div className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
            <Wifi className="h-3 w-3" />
            Online
          </div>
        ) : (
          <div className="flex items-center gap-1 px-2 py-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
            <WifiOff className="h-3 w-3" />
            Offline Mode
          </div>
        )}
      </div>
    );
  }

  // Don't show button if not installable or iOS
  if (!isInstallable && !isIos) {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold animate-pulse"
          title="Download this app to use offline anytime"
        >
          <Download className="h-4 w-4" />
          Download for Offline
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogTitle className="text-lg font-bold">
          📱 Download Todify for Offline Access
        </AlertDialogTitle>
        <AlertDialogDescription className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              ✨ Works Without Internet!
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Download this app on your device and use it anytime, anywhere - even with no internet connection.
            </p>
          </div>

          {isIos ? (
            <div>
              <p className="font-semibold mb-3">📲 Steps for iPhone/iPad:</p>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">1</div>
                  <p className="text-sm">Tap the <strong>Share</strong> button (⬆️)</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">2</div>
                  <p className="text-sm">Scroll down and tap <strong>Add to Home Screen</strong></p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">3</div>
                  <p className="text-sm">Tap <strong>Add</strong> in the top right</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                💡 The app will appear on your home screen. Tap it anytime to use it offline!
              </p>
            </div>
          ) : (
            <div>
              <p className="font-semibold mb-2">🎯 One-Click Download</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                The app will be installed on your device as a standalone application. You can access it anytime without needing the browser.
              </p>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 space-y-2">
                <p className="font-semibold text-sm text-green-900 dark:text-green-100">✅ After Download:</p>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>✓ Access from home screen or app drawer</li>
                  <li>✓ Works completely offline</li>
                  <li>✓ Automatic background updates</li>
                  <li>✓ Fast access, like a native app</li>
                </ul>
              </div>
            </div>
          )}
        </AlertDialogDescription>

        <div className="flex gap-3 pt-4">
          <AlertDialogCancel className="flex-1">Not Now</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleInstall} 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold gap-2"
          >
            <Download className="h-4 w-4" />
            {isIos ? 'Got it!' : 'Download Now'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
