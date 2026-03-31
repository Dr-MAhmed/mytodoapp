import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePwaInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [serviceWorkerRegistered, setServiceWorkerRegistered] = useState(false);

  useEffect(() => {
    // Check if PWA is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIos(isIOSDevice);

    // Check service worker status
    const checkServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        setServiceWorkerRegistered(!!registration);
      } catch (error) {
        console.warn('Service worker check failed:', error);
      }
    };

    checkServiceWorker();

    // Debug logging
    console.log('🔍 PWA Status Check:', {
      isIOS: isIOSDevice,
      isStandalone: window.matchMedia('(display-mode: standalone)').matches,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
    });

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎯 PWA beforeinstallprompt event fired!', e);
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Handle successful installation
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      if (isIos) {
        alert(
          'To install this app on iOS:\n\n1. Tap Share button\n2. Tap Add to Home Screen\n3. Tap Add'
        );
      } else {
        // Check if service worker is registered
        const registration = await navigator.serviceWorker.getRegistration();
        const hasServiceWorker = !!registration;
        
        const message = `PWA installation not ready yet. Please ensure:\n\n${
          hasServiceWorker ? '✅' : '❌'
        } Service Worker registered\n${
          window.location.protocol === 'https:' || window.location.hostname === 'localhost' ? '✅' : '❌'
        } HTTPS or localhost\n\nTry refreshing the page and interacting with the app first, then click install again.\n\nAlternatively, use your browser menu:\n- Chrome: Menu (⋮) → Install Todify\n- Edge: Menu (⋯) → Apps → Install this site as an app\n- Firefox: Menu (☰) → Install This Site as an App`;
        
        alert(message);
      }
      console.warn('PWA install trigger is unavailable. Ensure user engagement criteria are met.');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstalled(true);
        setIsInstallable(false);
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }
  };

  return {
    isInstallable,
    isInstalled,
    isIos,
    handleInstall,
    debugInfo: {
      hasDeferredPrompt: !!deferredPrompt,
      serviceWorkerRegistered,
      isHttps: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
      userAgent: navigator.userAgent,
    },
  };
};
