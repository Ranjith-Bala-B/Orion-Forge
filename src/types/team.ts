export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  detailedAbout: string;
  skills: string[];
  experience: string[];
  projects: string[];
  email: string;
  phone: string;
  socials: {
    linkedin: string;
    github: string;
    instagram: string;
  };
  cvUrl: string;
}
