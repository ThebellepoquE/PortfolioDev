export type MetricType = 'performance' | 'business' | 'users' | 'technical' | 'code-quality';

export interface ProjectMetric {
  id: string;
  type: MetricType;
  value: string;
  label: string;
  description?: string;
  icon?: string;
  baseline?: {
    previous: string;
    improvement: string;
  };
}

export interface ProjectLink {
  type: 'github' | 'live' | 'case-study' | 'video' | 'docs';
  url: string;
  title: string;
  isPrimary?: boolean;
}

export interface TechnicalChallenge {
  title: string;
  description: string;
  solution: string;
  technologies: string[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  complexity: number;
  innovation: number;
  impact: number;
  technologies: string[];
  image: string;
  imageAlt?: string;
  metrics: ProjectMetric[];
  links: ProjectLink[];
  challenges: TechnicalChallenge[];
  architecture?: string;
  learnings?: string[];
  featured: boolean;
  date: string;
  duration?: string;
  role: string;
  team?: {
    size: number;
    structure: string;
  };
  relatedPosts?: string[];
}
