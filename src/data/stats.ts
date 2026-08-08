import { StatItem } from '../types/stat';

export const statsData: StatItem[] = [
  {
    id: 'projects',
    label: 'Projects Completed',
    value: 18,
    suffix: '+',
    description: 'High-impact AI, UAV & system deployments',
    iconName: 'Cpu',
  },
  {
    id: 'hackathons',
    label: 'Hackathons Participated',
    value: 42,
    suffix: '+',
    description: 'National & international competitions',
    iconName: 'Trophy',
  },
  {
    id: 'awards',
    label: 'Awards Won',
    value: 12,
    suffix: '+',
    description: 'First place titles & innovation honors',
    iconName: 'Award',
  },
  {
    id: 'research',
    label: 'Research Papers',
    value: 5,
    suffix: '+',
    description: 'IEEE & AI journal publications',
    iconName: 'BookOpen',
  },
  {
    id: 'team',
    label: 'Team Members',
    value: 8,
    suffix: '+',
    description: 'Engineers, researchers & visionaries',
    iconName: 'Users',
  },
];
