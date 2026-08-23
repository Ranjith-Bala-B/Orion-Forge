import React, { useState, useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { ForgeVaultPage } from './pages/ForgeVaultPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ROUTES } from './constants/routes';
import { ErrorBoundary } from './components/ErrorBoundary';
import { migrateToSupabase } from './utils/supabaseMigration';
import { supabase } from './config/supabase';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || ROUTES.HOME;
  });
  const [cmsUpdateTrigger, setCmsUpdateTrigger] = useState(0);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || ROUTES.HOME);
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'orion_cms_data') {
        setCmsUpdateTrigger(prev => prev + 1);
      }
    };
    
    const handleCustomCmsUpdate = () => {
      setCmsUpdateTrigger(prev => prev + 1);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('cms_updated', handleCustomCmsUpdate);
    
    // Listen for database changes to update live website immediately
    const channel = supabase.channel('app-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        () => {
          handleCustomCmsUpdate();
        }
      )
      .subscribe();
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cms_updated', handleCustomCmsUpdate);
      supabase.removeChannel(channel);
    };
  }, []);

  const navigate = (path: string) => {
    if (path.startsWith('#')) {
      if (currentPath !== ROUTES.HOME) {
        window.history.pushState({}, '', ROUTES.HOME);
        setCurrentPath(ROUTES.HOME);
        setTimeout(() => {
          const el = document.querySelector(path);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.querySelector(path);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPath) {
      case ROUTES.HOME:
        return <HomePage key={`home-${cmsUpdateTrigger}`} onNavigate={navigate} />;
      case ROUTES.FORGE_VAULT:
        return <ForgeVaultPage onNavigate={navigate} />;
      default:
        return <NotFoundPage onNavigate={navigate} />;
    }
  };

  const pageTitle = currentPath === ROUTES.FORGE_VAULT
    ? 'Forge Vault — Orion Forge Command Center'
    : 'Orion Forge — Forging Ideas. Building Intelligent Solutions.';

  return (
    <ErrorBoundary>
      <MainLayout currentPath={currentPath} onNavigate={navigate} title={pageTitle}>
        {renderPage()}
      </MainLayout>
    </ErrorBoundary>
  );
}

export default App;
