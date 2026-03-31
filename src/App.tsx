import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import { Loader2 } from 'lucide-react';

/** Shows when session is being loaded */
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

/** Routes that require the user to be signed in */
function AuthenticatedRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Login />;

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const App: React.FC = () => {
  usePwaInstall();

  return (
    <Router>
      <AuthProvider>
        <IntersectObserver />
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <AuthenticatedRoutes />
          </main>
        </div>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;
