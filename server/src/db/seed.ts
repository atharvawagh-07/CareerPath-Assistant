import bcrypt from 'bcryptjs';
import { getDb, execute, queryOne } from './client.ts';
import { getAllCareers, getAllSkills, get30QuizQuestions, get52Projects, get52Resources } from './seedGenerator.ts';

export async function runSeed() {
  console.log('[Seed] Starting database seeding process...');
  const db = await getDb();

  // Check if users already exist
  const existingUser = await queryOne('SELECT id FROM users LIMIT 1');
  if (existingUser) {
    console.log('[Seed] Database already seeded. Skipping initial population.');
    return;
  }

  console.log('[Seed] Seeding Default Users...');
  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash('Admin@12345', salt);
  const studentHash = await bcrypt.hash('Student@12345', salt);

  await execute(
    `INSERT INTO users (id, name, email, password_hash, role, education_level, institution, interests, career_goals, work_environment)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      'usr-admin-01',
      'System Administrator',
      'admin@careerpath.edu',
      adminHash,
      'ADMIN',
      'Master of Computer Science',
      'Global Tech Institute',
      JSON.stringify(['Software', 'AI & Data', 'Cybersecurity', 'Cloud']),
      'Overseeing student career guidance and curriculum platform performance.',
      'Hybrid Tech Office'
    ]
  );

  await execute(
    `INSERT INTO users (id, name, email, password_hash, role, education_level, institution, interests, career_goals, work_environment)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      'usr-student-01',
      'Alex Mercer',
      'student@careerpath.edu',
      studentHash,
      'STUDENT',
      'Undergraduate Junior (Year 3)',
      'University of Technology & Science',
      JSON.stringify(['Software', 'AI & Data', 'Cloud']),
      'Aspiring Full-Stack & Cloud Engineer aiming to build high-scale web products.',
      'Flexible Remote / Collaborative'
    ]
  );

  console.log('[Seed] Seeding Skills (100+)...');
  const skills = getAllSkills();
  for (const s of skills) {
    await execute(
      `INSERT INTO skills (id, name, category, difficulty, description, related_careers)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (name) DO NOTHING`,
      [s.id, s.name, s.category, s.difficulty, s.description, JSON.stringify(s.relatedCareers)]
    );
  }

  console.log('[Seed] Seeding Careers (50+)...');
  const careers = getAllCareers();
  for (const c of careers) {
    await execute(
      `INSERT INTO careers (id, title, slug, category, description, overview, responsibilities, education, difficulty, demand_level, future_growth, salary_min, salary_max, skills, tools, industries, pros, cons)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       ON CONFLICT (slug) DO NOTHING`,
      [
        c.id, c.title, c.slug, c.category, c.description, c.overview,
        JSON.stringify(c.responsibilities), c.education, c.difficulty, c.demandLevel,
        c.futureGrowth, c.salaryMin, c.salaryMax,
        JSON.stringify(c.skills), JSON.stringify(c.tools), JSON.stringify(c.industries),
        JSON.stringify(c.pros), JSON.stringify(c.cons)
      ]
    );

    // Link skills
    for (const skillName of c.skills) {
      const skillRow = await queryOne('SELECT id FROM skills WHERE name = $1', [skillName]);
      if (skillRow) {
        const linkId = `cs-${c.id}-${skillRow.id}`;
        await execute(
          `INSERT INTO career_skills (id, career_id, skill_id)
           VALUES ($1, $2, $3)
           ON CONFLICT DO NOTHING`,
          [linkId, c.id, skillRow.id]
        );
      }
    }
  }

  console.log('[Seed] Seeding 30 Quiz Questions...');
  const questions = get30QuizQuestions();
  for (const q of questions) {
    await execute(
      `INSERT INTO quiz_questions (id, question, category, options, weight, active, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO NOTHING`,
      [q.id, q.question, q.category, JSON.stringify(q.options), q.weight, true, q.order]
    );
  }

  console.log('[Seed] Seeding 50+ Projects...');
  const projects = get52Projects();
  for (const p of projects) {
    await execute(
      `INSERT INTO projects (id, title, slug, description, difficulty, category, technologies, skills, portfolio_value, duration, deliverables)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (slug) DO NOTHING`,
      [
        p.id, p.title, p.slug, p.description, p.difficulty, p.category,
        JSON.stringify(p.technologies), JSON.stringify(p.skills),
        p.portfolioValue, p.duration, JSON.stringify(p.deliverables)
      ]
    );
  }

  console.log('[Seed] Seeding 50+ Resources...');
  const resources = get52Resources();
  for (const r of resources) {
    await execute(
      `INSERT INTO resources (id, title, description, category, difficulty, is_free, url, provider)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING`,
      [r.id, r.title, r.description, r.category, r.difficulty, r.isFree, r.url, r.provider]
    );
  }

  console.log('[Seed] Seeding initial roadmap and progress for default student user...');
  // Roadmap for Full-Stack Software Engineer
  const fsCareer = careers.find(c => c.slug === 'full-stack-software-engineer') || careers[0];
  const roadmapId = 'rdm-student-01';
  await execute(
    `INSERT INTO roadmaps (id, user_id, career_id, title, progress)
     VALUES ($1, $2, $3, $4, $5)`,
    [roadmapId, 'usr-student-01', fsCareer.id, 'Full-Stack Software Engineer Roadmap', 35]
  );

  const steps = [
    {
      id: 'step-1',
      title: 'Web Fundamentals & Modern JavaScript',
      desc: 'Master semantic HTML5, modern CSS layouts (Flexbox/Grid), and ES6+ asynchronous JavaScript.',
      cat: 'Foundations',
      hrs: 40,
      order: 1,
      completed: true,
      skills: ['HTML5 & Semantic Web', 'CSS & Responsive Layouts', 'JavaScript'],
      resources: ['CS50: Introduction to Computer Science', 'freeCodeCamp: Responsive Web Design'],
      projects: ['Personal Portfolio & Blog']
    },
    {
      id: 'step-2',
      title: 'TypeScript & Modern React Development',
      desc: 'Build modular, reactive single-page applications using TypeScript, React hooks, and Tailwind CSS.',
      cat: 'Frontend Core',
      hrs: 50,
      order: 2,
      completed: true,
      skills: ['TypeScript', 'React', 'Tailwind CSS'],
      resources: ['Full Stack Open 2025 (University of Helsinki)'],
      projects: ['Production Full-Stack E-Commerce Platform with Stripe']
    },
    {
      id: 'step-3',
      title: 'Backend APIs, Express & Database Architecture',
      desc: 'Design RESTful endpoints, implement JWT authentication, and model relational data with PostgreSQL.',
      cat: 'Backend & Data',
      hrs: 60,
      order: 3,
      completed: false,
      skills: ['Node.js & Express', 'SQL', 'PostgreSQL', 'RESTful API Design'],
      resources: ['The Odin Project: Full Stack Open Curriculum'],
      projects: ['Real-Time Collaborative Code Editor with WebSockets']
    },
    {
      id: 'step-4',
      title: 'Testing, DevOps & Container Deployment',
      desc: 'Containerize web apps with Docker, write automated Playwright tests, and configure CI/CD deployments.',
      cat: 'Deployment & Quality',
      hrs: 45,
      order: 4,
      completed: false,
      skills: ['Docker & Containers', 'Git & GitHub', 'Playwright & Cypress'],
      resources: ['AWS Skill Builder: Cloud Practitioner Essentials'],
      projects: ['Cloud-Native Distributed File Storage System']
    },
    {
      id: 'step-5',
      title: 'Portfolio Polish, System Design & Interview Prep',
      desc: 'Refactor portfolio codebases, practice LeetCode patterns, and master behavioral storytelling.',
      cat: 'Career Readiness',
      hrs: 30,
      order: 5,
      completed: false,
      skills: ['Data Structures & Algorithms', 'Technical Communication'],
      resources: ['Tech Interview Handbook & Grind 75'],
      projects: ['Production Portfolio Defense']
    }
  ];

  for (const st of steps) {
    await execute(
      `INSERT INTO roadmap_steps (id, roadmap_id, title, description, category, estimated_hours, step_order, completed, skills, resources, projects)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        st.id, roadmapId, st.title, st.desc, st.cat, st.hrs, st.order, st.completed,
        JSON.stringify(st.skills), JSON.stringify(st.resources), JSON.stringify(st.projects)
      ]
    );
  }

  // Seed sample saved items for the student
  await execute(
    `INSERT INTO saved_careers (id, user_id, career_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
    ['sc-1', 'usr-student-01', fsCareer.id]
  );
  const aiCareer = careers.find(c => c.slug === 'ai-ml-engineer');
  if (aiCareer) {
    await execute(
      `INSERT INTO saved_careers (id, user_id, career_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      ['sc-2', 'usr-student-01', aiCareer.id]
    );
  }

  // Seed student skills
  const skillsToSeed = [
    { name: 'TypeScript', prof: 'Intermediate', prog: 65 },
    { name: 'React', prof: 'Intermediate', prog: 75 },
    { name: 'JavaScript', prof: 'Advanced', prog: 90 },
    { name: 'SQL', prof: 'Beginner', prog: 40 },
    { name: 'Git & GitHub', prof: 'Intermediate', prog: 80 }
  ];

  for (const sk of skillsToSeed) {
    const skillRow = await queryOne('SELECT id FROM skills WHERE name = $1', [sk.name]);
    if (skillRow) {
      await execute(
        `INSERT INTO user_skills (id, user_id, skill_id, proficiency, progress)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [`usk-${skillRow.id}`, 'usr-student-01', skillRow.id, sk.prof, sk.prog]
      );
    }
  }

  console.log('[Seed] Database seeding completed successfully!');
}

// Allow direct execution via tsx
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeed().then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error('Seed failure:', err);
    process.exit(1);
  });
}
