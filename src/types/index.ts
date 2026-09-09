export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  profileImage?: string | null;
  educationLevel?: string;
  institution?: string;
  interests?: string[];
  careerGoals?: string;
  workEnvironment?: string;
}

export interface Career {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  overview: string;
  responsibilities: string[];
  education: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  demand_level: 'Moderate' | 'High' | 'Very High';
  future_growth: string;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  skills: string[];
  tools: string[];
  industries: string[];
  pros: string[];
  cons: string[];
  verifiedSkills?: Skill[];
  recommendedProjects?: Project[];
  recommendedResources?: Resource[];
  isSaved?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  description: string;
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced';
  progress?: number;
}

export interface QuizOption {
  id: string;
  text: string;
  categoryAffinities: Record<string, number>;
  traits: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  category: string;
  weight: number;
  order: number;
  options: QuizOption[];
}

export interface CareerRecommendation {
  careerId: string;
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  demandLevel: string;
  salaryMin: number;
  salaryMax: number;
  matchPercentage: number;
  reasons: string[];
  skillGaps: string[];
}

export interface RoadmapStep {
  id: string;
  roadmap_id: string;
  title: string;
  description: string;
  category: string;
  estimated_hours: number;
  step_order: number;
  completed: boolean;
  skills: string[];
  resources: string[];
  projects: string[];
}

export interface Roadmap {
  id: string;
  user_id: string;
  career_id: string;
  title: string;
  progress: number;
  career_title?: string;
  career_slug?: string;
  career_category?: string;
  steps?: RoadmapStep[];
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  technologies: string[];
  skills: string[];
  portfolio_value: 'Medium' | 'High' | 'Very High';
  duration: string;
  deliverables: string[];
  userStatus?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  userProgress?: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  is_free: boolean;
  url: string;
  provider: string;
  isSaved?: boolean;
}

export interface ReadinessScore {
  totalScore: number;
  level: 'Beginner' | 'Developing' | 'Job Ready';
  breakdown: {
    skillsScore: number;
    projectsScore: number;
    roadmapScore: number;
    portfolioScore: number;
  };
  stats: {
    skillsCount: number;
    projectsCompleted: number;
    roadmapProgress: number;
    savedCareersCount: number;
  };
  recommendedActions: string[];
}
