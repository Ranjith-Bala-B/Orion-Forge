import { SiteConfig } from './site';
import { TeamMember } from './team';
import { Project } from './project';
import { Achievement } from './achievement';
import { StatItem } from './stat';
import { TimelineItem } from './timeline';

export interface CMSData {
  site: SiteConfig;
  team: TeamMember[];
  projects: Project[];
  achievements: Achievement[];
  stats: StatItem[];
  timeline: TimelineItem[];
}
