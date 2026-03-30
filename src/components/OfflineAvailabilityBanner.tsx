import React, { useState, useEffect } from 'react';
import { Download, Wifi, WifiOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const OfflineAvailabilityBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show offline notification if user goes offline and has app installed
  if (!isOnline && isInstalled && !isDismissed) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <WifiOff className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">You're Offline</p>
              <p className="text-xs opacity-90">Your todos are safe - continue working offline!</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 h-8 w-8 flex-shrink-0"
            onClick={() => setIsDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Show installation prompt if not installed and online
  if (isOnline && !isInstalled && !isDismissed) {
    return (
      <div className="sticky top-0 z-40 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Download className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">📱 Get Offline Access</p>
              <p className="text-xs opacity-90">
                Download Todify to access your tasks anytime, anywhere - even without internet!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setIsDismissed(true)}
            >
              Dismiss
            </Button>
            <Button
              size="sm"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
              onClick={() => {
                // Trigger the download button click
                const downloadBtn = document.querySelector('[title="Download this app to use offline anytime"]') as HTMLButtonElement;
                if (downloadBtn) {
                  downloadBtn.click();
                }
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show online status with installed indicator
  if (isInstalled && isOnline && !isDismissed) {
    return (
      <div className="sticky top-0 z-40 bg-green-50 dark:bg-green-950/20 border-b border-green-200 dark:border-green-800 text-green-900 dark:text-green-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Wifi className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="font-semibold">Apps ready for offline use</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-green-700 dark:text-green-300 hover:bg-green-200/30"
            onClick={() => setIsDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
