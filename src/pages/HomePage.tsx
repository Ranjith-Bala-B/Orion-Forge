import React, { Suspense } from 'react';
import { HeroSection } from '../components/HeroSection';
import { ROUTES } from '../constants/routes';

const AboutSection = React.lazy(() => import('../components/AboutSection').then(m => ({ default: m.AboutSection })));
const StatsSection = React.lazy(() => import('../components/StatsSection').then(m => ({ default: m.StatsSection })));
const TeamSection = React.lazy(() => import('../components/TeamSection').then(m => ({ default: m.TeamSection })));
const AchievementsSection = React.lazy(() => import('../components/AchievementsSection').then(m => ({ default: m.AchievementsSection })));
const ProjectsSection = React.lazy(() => import('../components/ProjectsSection').then(m => ({ default: m.ProjectsSection })));
const ContactSection = React.lazy(() => import('../components/ContactSection').then(m => ({ default: m.ContactSection })));

interface HomePageProps {
  onNavigate?: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col">
      <HeroSection onNavigateToVault={() => onNavigate && onNavigate(ROUTES.FORGE_VAULT)} />
      <Suspense fallback={<div className="h-32 flex items-center justify-center text-slate-500">Loading...</div>}>
        <AboutSection />
        <StatsSection />
        <TeamSection />
        <AchievementsSection />
        <ProjectsSection />
        <ContactSection />
      </Suspense>
    </div>
  );
};
