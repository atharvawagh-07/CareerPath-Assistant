import { Career, CareerRecommendation, Project, QuizQuestion, ReadinessScore, Resource, Roadmap, Skill, User } from '../types';

const API_BASE = '/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('careerpath_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ message: string; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (data: { name: string; email: string; password: string; educationLevel?: string; institution?: string }) =>
    request<{ message: string; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getMe: () => request<{ user: User }>('/auth/me'),

  updateProfile: (data: Partial<User>) =>
    request<{ message: string; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Careers
  getCareers: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<{ careers: Career[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
      `/careers${query ? `?${query}` : ''}`
    );
  },

  getCareerCategories: () =>
    request<{ categories: { category: string; count: string | number }[] }>('/careers/categories'),

  getCareerBySlug: (slug: string) => request<{ career: Career }>(`/careers/${slug}`),

  createCareer: (data: any) =>
    request<{ message: string; career: Career }>('/careers', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateCareer: (id: string, data: any) =>
    request<{ message: string; career: Career }>(`/careers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  deleteCareer: (id: string) =>
    request<{ message: string }>(`/careers/${id}`, { method: 'DELETE' }),

  // Quiz
  getQuizQuestions: () => request<{ questions: QuizQuestion[] }>('/quiz/questions'),

  submitQuiz: (answers: { questionId: string; answerId: string }[]) =>
    request<{ message: string; recommendations: CareerRecommendation[]; topCareer: CareerRecommendation }>('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify({ answers })
    }),

  getQuizResults: () =>
    request<{ hasCompletedQuiz: boolean; latestResult: any; recommendations: CareerRecommendation[] }>('/quiz/results'),

  // Recommendations
  getRecommendations: () => request<{ recommendations: CareerRecommendation[] }>('/recommendations'),

  // Roadmaps
  getRoadmaps: () => request<{ roadmaps: Roadmap[] }>('/roadmaps'),

  getRoadmap: (id: string) => request<{ roadmap: Roadmap }>(`/roadmaps/${id}`),

  generateRoadmap: (careerId: string) =>
    request<{ message: string; roadmapId: string }>(`/roadmaps/generate/${careerId}`, { method: 'POST' }),

  toggleRoadmapStep: (stepId: string) =>
    request<{ message: string; stepId: string; completed: boolean; roadmapProgress: number }>(
      `/roadmaps/steps/${stepId}/toggle`,
      { method: 'PUT' }
    ),

  deleteRoadmap: (id: string) => request<{ message: string }>(`/roadmaps/${id}`, { method: 'DELETE' }),

  // Skills
  getSkills: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<{ skills: Skill[] }>(`/skills${query ? `?${query}` : ''}`);
  },

  getUserSkills: () => request<{ userSkills: Skill[] }>('/skills/user'),

  saveUserSkill: (data: { skillId: string; proficiency: string; progress: number }) =>
    request<{ message: string }>('/skills/user', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  deleteUserSkill: (skillId: string) => request<{ message: string }>(`/skills/user/${skillId}`, { method: 'DELETE' }),

  // Projects
  getProjects: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<{ projects: Project[] }>(`/projects${query ? `?${query}` : ''}`);
  },

  updateProjectProgress: (projectId: string, status: string, progress: number) =>
    request<{ message: string }>('/projects/progress', {
      method: 'POST',
      body: JSON.stringify({ projectId, status, progress })
    }),

  // Resources
  getResources: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<{ resources: Resource[] }>(`/resources${query ? `?${query}` : ''}`);
  },

  // Saved Bookmarks
  getSavedCareers: () => request<{ savedCareers: Career[] }>('/saved/careers'),

  toggleSaveCareer: (careerId: string) =>
    request<{ message: string; isSaved: boolean }>(`/saved/careers/${careerId}`, { method: 'POST' }),

  getSavedResources: () => request<{ savedResources: Resource[] }>('/saved/resources'),

  toggleSaveResource: (resourceId: string) =>
    request<{ message: string; isSaved: boolean }>(`/saved/resources/${resourceId}`, { method: 'POST' }),

  // Readiness Score
  getReadiness: () => request<{ readiness: ReadinessScore }>('/readiness'),

  // Feedback
  submitFeedback: (data: { name: string; email: string; message: string; type?: string }) =>
    request<{ message: string }>('/feedback', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getFeedbackList: () => request<{ feedback: any[] }>('/feedback'),

  updateFeedbackStatus: (id: string, status: string) =>
    request<{ message: string }>(`/feedback/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),

  // Admin
  getAdminStats: () => request<{ stats: any }>('/admin/stats'),
  getAdminAnalytics: async () => {
    const res = await request<{ stats: any }>('/admin/stats');
    return { analytics: res.stats };
  },

  getAdminCareers: () => request<{ careers: Career[] }>('/careers?limit=100'),

  createAdminCareer: (data: any) =>
    request<{ message: string; career: Career }>('/careers', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  deleteAdminCareer: (id: string) =>
    request<{ message: string }>(`/careers/${id}`, { method: 'DELETE' }),

  getAdminUsers: () => request<{ users: any[] }>('/admin/users'),

  updateAdminUserRole: (id: string, role: string) =>
    request<{ message: string }>(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    }),

  updateUserRole: (id: string, role: string) =>
    request<{ message: string }>(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    }),

  getAdminFeedback: () => request<{ feedback: any[] }>('/feedback')
};
