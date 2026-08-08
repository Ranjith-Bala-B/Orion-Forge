export const ROUTES = {
  HOME: '/',
  ABOUT: '#about',
  TEAM: '#team',
  ACHIEVEMENTS: '#achievements',
  PROJECTS: '#projects',
  CONTACT: '#contact',
  FORGE_VAULT: '/forge-vault',
} as const;

export const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Team', href: '#team' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
] as const;
