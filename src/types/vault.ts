export type HackathonType = string;
export type HackathonMode = 'Online' | 'Offline' | 'Hybrid';
export type HackathonStatus = 'Upcoming' | 'In Progress' | 'Completed' | 'Archived';
export type RoundType = 'Quiz' | 'Coding' | 'PPT' | 'Prototype' | 'Presentation' | 'Interview' | 'Custom';
export type RoundStatus = 'Pending' | 'Completed' | 'Closed';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type HistoryResult = 'Winner' | '1st Runner Up' | '2nd Runner Up' | 'Runner-up' | 'Shortlisted' | 'Participation';

export interface Round {
  id: string;
  name: string;
  type: RoundType;
  mode: HackathonMode;
  startDate: string;
  startTime: string;
  deadlineDate: string;
  deadlineTime: string;
  submissionDetails: string;
  submissionRequirements: string;
  resultDate: string;
  status: RoundStatus;
  remarks: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  priority: TaskPriority;
  assignedMember: string;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'pdf' | 'pptx' | 'video' | 'link' | 'code' | 'image';
  url: string;
  size?: string;
  uploadedAt: string;
  category: 'Rulebook' | 'Problem Statement' | 'PPT Template' | 'Final PPT' | 'Prototype' | 'Report' | 'Demo Video' | 'GitHub' | 'Deployment' | 'Certificate';
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  type: string;
}

export interface TeamAssignment {
  id: string;
  memberName: string;
  role: string;
  responsibility: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface CertificateItem {
  id: string;
  name: string;
  url: string;
  date: string;
}

export interface Hackathon {
  id: string;
  name: string;
  type: HackathonType;
  organizer: string;
  mode: HackathonMode;
  websiteUrl: string;
  registrationUrl: string;
  problemStatement: string;
  description: string;
  status: HackathonStatus;
  createdAt: string;
  rounds: Round[];
  tasks: TaskItem[];
  documents: DocumentItem[];
  links: LinkItem[];
  team: TeamAssignment[];
  notes: NoteItem[];
  isGameOver?: boolean;
}

export interface HistoryEntry {
  id: string;
  hackathonId: string;
  hackathonName: string;
  projectName: string;
  organizer: string;
  date: string;
  roundsCount: number;
  result: HistoryResult;
  resultDetails: string; // e.g. "1st Place Winner ($5,000 Prize)"
  description: string;
  problemStatement?: string;
  teamMembers: string[];
  rounds?: Round[];
  documents: DocumentItem[];
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  certificateUrl?: string;
  certificates?: CertificateItem[];
  pptUrl?: string;
  gallery: string[];
  overview?: string;
  roundResults?: Record<string, string>;
  projectLinks?: LinkItem[];
  hackathonLinks?: LinkItem[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'round_closed' | 'result' | 'task' | 'upload';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface VaultSettings {
  rememberDevice: boolean;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  emailAlerts: boolean;
  lastBackupDate?: string;
}
