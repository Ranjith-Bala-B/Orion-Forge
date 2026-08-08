export interface Achievement {
  id: string;
  title: string;
  event: string;
  date: string;
  badge: string;
  description: string;
  fullDescription: string;
  image: string;
  certificatePreview: string;
  certificateDownloadUrl?: string;
  gallery: string[];
  teamMembers: string[];
}
