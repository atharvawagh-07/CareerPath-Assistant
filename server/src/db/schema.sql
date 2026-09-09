-- CareerPath PostgreSQL Database Schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'STUDENT',
  profile_image TEXT,
  education_level TEXT,
  institution TEXT,
  interests JSONB DEFAULT '[]'::jsonb,
  career_goals TEXT,
  work_environment TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS careers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  overview TEXT NOT NULL,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  education TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  demand_level TEXT NOT NULL,
  future_growth TEXT NOT NULL,
  salary_min INTEGER NOT NULL,
  salary_max INTEGER NOT NULL,
  salary_currency TEXT DEFAULT 'USD',
  skills JSONB DEFAULT '[]'::jsonb,
  tools JSONB DEFAULT '[]'::jsonb,
  industries JSONB DEFAULT '[]'::jsonb,
  pros JSONB DEFAULT '[]'::jsonb,
  cons JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_careers_slug ON careers(slug);
CREATE INDEX IF NOT EXISTS idx_careers_category ON careers(category);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  description TEXT NOT NULL,
  related_careers JSONB DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);

CREATE TABLE IF NOT EXISTS career_skills (
  id TEXT PRIMARY KEY,
  career_id TEXT NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE(career_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_career_skills_career ON career_skills(career_id);
CREATE INDEX IF NOT EXISTS idx_career_skills_skill ON career_skills(skill_id);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  options JSONB NOT NULL,
  weight REAL DEFAULT 1.0,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_category ON quiz_questions(category);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  score REAL DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quiz_answers_user ON quiz_answers(user_id);

CREATE TABLE IF NOT EXISTS quiz_results (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  result_data JSONB NOT NULL,
  top_career_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_quiz_results_user ON quiz_results(user_id);

CREATE TABLE IF NOT EXISTS career_recommendations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  career_id TEXT NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  match_percentage REAL NOT NULL,
  reasons JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, career_id)
);

CREATE INDEX IF NOT EXISTS idx_recommendations_user ON career_recommendations(user_id);

CREATE TABLE IF NOT EXISTS roadmaps (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  career_id TEXT NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  progress REAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_roadmaps_user ON roadmaps(user_id);

CREATE TABLE IF NOT EXISTS roadmap_steps (
  id TEXT PRIMARY KEY,
  roadmap_id TEXT NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  estimated_hours INTEGER DEFAULT 10,
  step_order INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  skills JSONB DEFAULT '[]'::jsonb,
  resources JSONB DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_roadmap_steps_roadmap ON roadmap_steps(roadmap_id);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  category TEXT NOT NULL,
  technologies JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  portfolio_value TEXT NOT NULL,
  duration TEXT DEFAULT '2-3 weeks',
  deliverables JSONB DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  is_free BOOLEAN DEFAULT true,
  url TEXT NOT NULL,
  provider TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);

CREATE TABLE IF NOT EXISTS saved_careers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  career_id TEXT NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, career_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_careers_user ON saved_careers(user_id);

CREATE TABLE IF NOT EXISTS saved_resources (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, resource_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_resources_user ON saved_resources(user_id);

CREATE TABLE IF NOT EXISTS user_skills (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  proficiency TEXT DEFAULT 'Beginner',
  progress INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);

CREATE TABLE IF NOT EXISTS project_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'NOT_STARTED',
  progress INTEGER DEFAULT 0,
  github_url TEXT,
  demo_url TEXT,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, project_id)
);

ALTER TABLE project_progress ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE project_progress ADD COLUMN IF NOT EXISTS demo_url TEXT;
ALTER TABLE project_progress ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE INDEX IF NOT EXISTS idx_project_progress_user ON project_progress(user_id);

CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'GENERAL',
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
