import React from 'react';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle } from 'lucide-react';

export const PwaInstallButton: React.FC<{ className?: string }> = ({ className }) => {
    const { isInstallable, isInstalled, install } = usePwaInstall();

    if (isInstalled) {
        return (
            <Button variant="ghost" size="sm" className={`gap-2 text-green-500 hover:text-green-600 ${className}`} disabled>
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Installed</span>
            </Button>
        );
    }

    if (!isInstallable) {
        return null;
    }

    return (
        <Button
            variant="default"
            size="sm"
            onClick={install}
            className={`gap-2 shadow-sm ${className}`}
        >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Install App</span>
        </Button>
    );
};
