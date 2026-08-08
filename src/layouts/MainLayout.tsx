import React, { useState } from 'react';
import { LoadingScreen } from '../components/LoadingScreen';
import { ScrollProgress } from '../components/ScrollProgress';
import { DynamicIslandNav } from '../components/DynamicIslandNav';
import { CustomCursor } from '../components/CustomCursor';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { ROUTES } from '../constants/routes';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  title?: string;
  description?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentPath = '/',
  onNavigate,
  title,
  description,
}) => {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <>
      <SEO title={title} description={description} />
      
      {/* Brand Opening Loading Sequence */}
      <LoadingScreen onComplete={() => setLoadingComplete(true)} />

      {/* Main Experience Layer */}
      <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${loadingComplete ? 'opacity-100' : 'opacity-0'}`}>
        <ScrollProgress />
        <CustomCursor />
        {currentPath !== ROUTES.FORGE_VAULT && (
          <DynamicIslandNav onNavigate={onNavigate} currentPath={currentPath} />
        )}

        <main className="flex-1">
          {children}
        </main>

        <Footer onNavigate={onNavigate} />
      </div>
    </>
  );
};
