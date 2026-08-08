export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  email: string;
  year: number;
  socials: {
    github: string;
    linkedin: string;
    youtube: string;
  };
  about: {
    image: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    titleLine4: string;
    subtitle: string;
    primaryCtaText: string;
    coreGraphicImage?: string;
  };
}
