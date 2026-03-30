import React from 'react';
import { Download, Wifi, WifiOff, Clock, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface OfflineFeatureCardProps {
  isOnline: boolean;
  isInstalled: boolean;
  onDownloadClick?: () => void;
}

export const OfflineFeatureCard: React.FC<OfflineFeatureCardProps> = ({
  isOnline,
  isInstalled,
  onDownloadClick,
}) => {
  // Show less prominent card if already installed
  if (isInstalled && isOnline) {
    return (
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2 text-green-900 dark:text-green-100">
              <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
              Offline Ready
            </CardTitle>
            <div className="text-green-600 dark:text-green-400 text-xs font-semibold bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded">
              Downloaded
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-green-800 dark:text-green-200">
          <p>Your app is ready to use offline. Use it anywhere, anytime!</p>
        </CardContent>
      </Card>
    );
  }

  // Show offline notification if user is offline
  if (!isOnline) {
    return (
      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-amber-900 dark:text-amber-100">
            <WifiOff className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-pulse" />
            You're Offline
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-800 dark:text-amber-200">
          <p className="mb-2 font-semibold">
            ✓ No worries! Your todos are working offline
          </p>
          <ul className="space-y-1 text-xs">
            <li>✓ Changes are saved locally</li>
            <li>✓ All features work without internet</li>
            <li>✓ Will sync when back online</li>
          </ul>
        </CardContent>
      </Card>
    );
  }

  // Show main download card if not installed and online
  return (
    <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/20 dark:to-blue-950/10 shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Download for Offline Access
            </CardTitle>
            <CardDescription className="text-blue-800 dark:text-blue-200 mt-2">
              Get instant access to your tasks anywhere, even without internet
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-gray-900/30 border border-blue-100 dark:border-blue-800/50">
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">
                Works Offline
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Use anywhere, no WiFi needed
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-gray-900/30 border border-blue-100 dark:border-blue-800/50">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">
                Always Available
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Fast access from home screen
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-gray-900/30 border border-blue-100 dark:border-blue-800/50">
            <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">
                Your Data Stays Safe
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Stored securely on device
              </p>
            </div>
          </div>
        </div>

        {/* Download button */}
        <Button
          onClick={onDownloadClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-base gap-2"
        >
          <Download className="h-5 w-5" />
          Download App Now
        </Button>

        {/* Additional info */}
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          🎯 Available on Android, iPhone, Windows, Mac & Linux
        </p>
      </CardContent>
    </Card>
  );
};
