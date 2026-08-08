export interface ProjectLinks {
  repository: string;
  demo?: string;
  documentation?: string;
  ppt?: string;
  video?: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  problemStatement: string;
  solution: string;
  features: string[];
  techStack: string[];
  architectureDiagram: string;
  resultsImpact: string;
  thumbnail: string;
  coverImage: string;
  gallery: string[];
  links: ProjectLinks;
}
