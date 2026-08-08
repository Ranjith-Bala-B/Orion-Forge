import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { StatsSection } from '../components/StatsSection';
import { TeamSection } from '../components/TeamSection';
import { AchievementsSection } from '../components/AchievementsSection';
import { ProjectsSection } from '../components/ProjectsSection';
import { ContactSection } from '../components/ContactSection';
import { ROUTES } from '../constants/routes';

interface HomePageProps {
  onNavigate?: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col">
      <HeroSection onNavigateToVault={() => onNavigate && onNavigate(ROUTES.FORGE_VAULT)} />
      <AboutSection />
      <StatsSection />
      <TeamSection />
      <AchievementsSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
};
