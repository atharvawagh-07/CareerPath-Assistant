import { Response } from 'express';
import { query, queryOne, execute } from '../db/client.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export async function getUserRoadmaps(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ roadmaps: [] });
    }

    const roadmaps = await query(
      `SELECT r.*, c.title as career_title, c.slug as career_slug, c.category as career_category
       FROM roadmaps r
       JOIN careers c ON r.career_id = c.id
       WHERE r.user_id = $1
       ORDER BY r.updated_at DESC`,
      [userId]
    );

    if (roadmaps.length === 0) {
      return res.json({ roadmaps: [] });
    }

    const roadmapIds = roadmaps.map(r => r.id);
    const steps = await query(
      `SELECT * FROM roadmap_steps WHERE roadmap_id = ANY($1) ORDER BY step_order ASC`,
      [roadmapIds]
    );

    const stepsByRoadmap: Record<string, any[]> = {};
    for (const s of steps) {
      if (!stepsByRoadmap[s.roadmap_id]) {
        stepsByRoadmap[s.roadmap_id] = [];
      }
      stepsByRoadmap[s.roadmap_id].push({
        ...s,
        skills: typeof s.skills === 'string' ? JSON.parse(s.skills) : s.skills,
        resources: typeof s.resources === 'string' ? JSON.parse(s.resources) : s.resources,
        projects: typeof s.projects === 'string' ? JSON.parse(s.projects) : s.projects
      });
    }

    const fullRoadmaps = roadmaps.map(r => ({
      ...r,
      steps: stepsByRoadmap[r.id] || []
    }));

    return res.json({ roadmaps: fullRoadmaps });
  } catch (err: any) {
    console.error('getUserRoadmaps error:', err);
    return res.status(500).json({ error: 'Failed to fetch career roadmaps.' });
  }
}

export async function getRoadmapById(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const roadmap = await queryOne(
      `SELECT r.*, c.title as career_title, c.slug as career_slug, c.category as career_category, c.difficulty as career_difficulty
       FROM roadmaps r
       JOIN careers c ON r.career_id = c.id
       WHERE r.id = $1`,
      [id]
    );

    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }

    // Enforce privacy: only owner or admin can view custom saved roadmaps
    if (userId && roadmap.user_id !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied: this roadmap belongs to another student.' });
    }

    const steps = await query(
      `SELECT * FROM roadmap_steps WHERE roadmap_id = $1 ORDER BY step_order ASC`,
      [id]
    );

    return res.json({
      roadmap: {
        ...roadmap,
        steps: steps.map(s => ({
          ...s,
          skills: typeof s.skills === 'string' ? JSON.parse(s.skills) : s.skills,
          resources: typeof s.resources === 'string' ? JSON.parse(s.resources) : s.resources,
          projects: typeof s.projects === 'string' ? JSON.parse(s.projects) : s.projects
        }))
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch roadmap details.' });
  }
}

export async function generateRoadmap(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Please log in or create an account to generate personal roadmaps.' });
    }
    const { careerId } = req.params;

    const career = await queryOne('SELECT * FROM careers WHERE id = $1', [careerId]);
    if (!career) {
      return res.status(404).json({ error: 'Target career not found.' });
    }

    // Check if user already has a roadmap for this career
    const existing = await queryOne('SELECT id FROM roadmaps WHERE user_id = $1 AND career_id = $2', [userId, careerId]);
    if (existing) {
      return res.json({ message: 'Roadmap already exists.', roadmapId: existing.id });
    }

    const roadmapId = `rdm-${Date.now()}`;
    await execute(
      `INSERT INTO roadmaps (id, user_id, career_id, title, progress)
       VALUES ($1, $2, $3, $4, 0)`,
      [roadmapId, userId, career.id, `${career.title} Mastery Roadmap`]
    );

    const careerSkills: string[] = typeof career.skills === 'string' ? JSON.parse(career.skills) : (career.skills || []);

    // Generate 5 structured stages
    const templateSteps = [
      {
        title: `Phase 1: Foundations & Core Prerequisites for ${career.title}`,
        desc: `Master the fundamental principles, terminal workflows, and core programming languages required for ${career.title}.`,
        cat: 'Foundations',
        hrs: 35,
        skills: careerSkills.slice(0, 2),
        resources: ['CS50: Introduction to Computer Science', 'freeCodeCamp Interactive Tutorials'],
        projects: [`Fundamentals Sandbox & CLI Utilities for ${career.category}`]
      },
      {
        title: `Phase 2: Core Tooling & Technical Frameworks`,
        desc: `Deep dive into modern production frameworks, database modeling, and industry toolsets.`,
        cat: 'Core Competency',
        hrs: 45,
        skills: careerSkills.slice(2, 4),
        resources: ['Official Documentation & Guided Courses'],
        projects: [`Production Prototype in ${career.category}`]
      },
      {
        title: `Phase 3: Production System Architecture & Advanced Specialization`,
        desc: `Implement scalable system patterns, security best practices, and integration pipelines.`,
        cat: 'Advanced Specialization',
        hrs: 55,
        skills: careerSkills.slice(4, 6),
        resources: ['Designing Data-Intensive Applications', 'Industry Best Practice Guides'],
        projects: [`High-Throughput Enterprise Architecture for ${career.title}`]
      },
      {
        title: `Phase 4: Capstone Portfolio Project`,
        desc: `Design and ship a complete, production-deployed application demonstrating end-to-end craftsmanship.`,
        cat: 'Portfolio Capstone',
        hrs: 50,
        skills: careerSkills.slice(0, 4),
        resources: ['GitHub Actions CI/CD Guides', 'Docker & Cloud Deployment Walkthroughs'],
        projects: [`End-to-End ${career.title} Capstone Solution`]
      },
      {
        title: `Phase 5: Technical Defense & Career Readiness`,
        desc: `Polish your technical resume, complete simulated mock interviews, and prepare portfolio walkthroughs.`,
        cat: 'Career Readiness',
        hrs: 25,
        skills: ['Technical Communication', 'System Design'],
        resources: ['Tech Interview Handbook', 'Portfolio Review Rubrics'],
        projects: ['Portfolio Defense & Live Case Study Walkthrough']
      }
    ];

    for (let i = 0; i < templateSteps.length; i++) {
      const st = templateSteps[i];
      const stepId = `step-${roadmapId}-${i + 1}`;
      await execute(
        `INSERT INTO roadmap_steps (id, roadmap_id, title, description, category, estimated_hours, step_order, completed, skills, resources, projects)
         VALUES ($1, $2, $3, $4, $5, $6, $7, false, $8, $9, $10)`,
        [
          stepId, roadmapId, st.title, st.desc, st.cat, st.hrs, i + 1,
          JSON.stringify(st.skills), JSON.stringify(st.resources), JSON.stringify(st.projects)
        ]
      );
    }

    return res.status(201).json({ message: 'Roadmap generated successfully.', roadmapId });
  } catch (err: any) {
    console.error('generateRoadmap error:', err);
    return res.status(500).json({ error: 'Failed to generate career roadmap.' });
  }
}

export async function toggleRoadmapStep(req: AuthenticatedRequest, res: Response) {
  try {
    const { stepId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to update milestones.' });
    }

    // Secure join query: verify that this step belongs to a roadmap owned by the authenticated user
    const stepWithRoadmap = await queryOne(
      `SELECT rs.*, r.user_id as owner_id
       FROM roadmap_steps rs
       JOIN roadmaps r ON rs.roadmap_id = r.id
       WHERE rs.id = $1`,
      [stepId]
    );

    if (!stepWithRoadmap) {
      return res.status(404).json({ error: 'Roadmap milestone step not found.' });
    }

    if (stepWithRoadmap.owner_id !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied: You do not have permission to modify this roadmap.' });
    }

    const newStatus = !stepWithRoadmap.completed;
    await execute('UPDATE roadmap_steps SET completed = $1 WHERE id = $2', [newStatus, stepId]);

    // Recalculate roadmap overall progress
    const steps = await query('SELECT completed FROM roadmap_steps WHERE roadmap_id = $1', [stepWithRoadmap.roadmap_id]);
    const completedCount = steps.filter(s => s.completed).length;
    const progress = Math.round((completedCount / steps.length) * 100);

    await execute(
      'UPDATE roadmaps SET progress = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [progress, stepWithRoadmap.roadmap_id]
    );

    return res.json({
      message: 'Milestone updated.',
      stepId,
      completed: newStatus,
      roadmapProgress: progress
    });
  } catch (err: any) {
    console.error('toggleRoadmapStep error:', err);
    return res.status(500).json({ error: 'Failed to update milestone status.' });
  }
}

export async function deleteRoadmap(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to delete roadmaps.' });
    }

    const roadmap = await queryOne('SELECT * FROM roadmaps WHERE id = $1', [id]);
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }

    if (roadmap.user_id !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied: You do not own this roadmap.' });
    }

    await execute('DELETE FROM roadmaps WHERE id = $1 AND user_id = $2', [id, userId]);
    return res.json({ message: 'Roadmap removed successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete roadmap.' });
  }
}
