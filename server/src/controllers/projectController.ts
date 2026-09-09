import { Response } from 'express';
import { query, queryOne, execute } from '../db/client.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export async function getProjects(req: AuthenticatedRequest, res: Response) {
  try {
    const { category, difficulty, portfolioValue, search } = req.query;
    const userId = req.user?.id;

    let sql = 'SELECT * FROM projects WHERE 1=1';
    const params: any[] = [];

    if (category && typeof category === 'string' && category !== 'All') {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    if (difficulty && typeof difficulty === 'string' && difficulty !== 'All') {
      params.push(difficulty);
      sql += ` AND difficulty = $${params.length}`;
    }

    if (portfolioValue && typeof portfolioValue === 'string' && portfolioValue !== 'All') {
      params.push(portfolioValue);
      sql += ` AND portfolio_value = $${params.length}`;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(description) LIKE $${params.length})`;
    }

    sql += ' ORDER BY portfolio_value DESC, title ASC';
    const rows = await query(sql, params);

    // Fetch user progress for these projects if authenticated
    const progressRows = userId
      ? await query('SELECT project_id, status, progress, github_url, demo_url, notes FROM project_progress WHERE user_id = $1', [userId])
      : [];
    const progressMap = new Map(progressRows.map(r => [r.project_id, r]));

    const formatted = rows.map(p => {
      const prog = progressMap.get(p.id);
      return {
        ...p,
        technologies: typeof p.technologies === 'string' ? JSON.parse(p.technologies) : p.technologies,
        skills: typeof p.skills === 'string' ? JSON.parse(p.skills) : p.skills,
        deliverables: typeof p.deliverables === 'string' ? JSON.parse(p.deliverables) : p.deliverables,
        userStatus: prog?.status || 'NOT_STARTED',
        userProgress: prog?.progress || 0,
        githubUrl: prog?.github_url || null,
        demoUrl: prog?.demo_url || null,
        submissionNotes: prog?.notes || null
      };
    });

    return res.json({ projects: formatted });
  } catch (err: any) {
    console.error('getProjects error:', err);
    return res.status(500).json({ error: 'Failed to fetch projects.' });
  }
}

export async function getProjectBySlug(req: AuthenticatedRequest, res: Response) {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    const project = await queryOne('SELECT * FROM projects WHERE slug = $1', [slug]);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const prog = userId
      ? await queryOne('SELECT status, progress, github_url, demo_url, notes FROM project_progress WHERE user_id = $1 AND project_id = $2', [userId, project.id])
      : null;

    return res.json({
      project: {
        ...project,
        technologies: typeof project.technologies === 'string' ? JSON.parse(project.technologies) : project.technologies,
        skills: typeof project.skills === 'string' ? JSON.parse(project.skills) : project.skills,
        deliverables: typeof project.deliverables === 'string' ? JSON.parse(project.deliverables) : project.deliverables,
        userStatus: prog?.status || 'NOT_STARTED',
        userProgress: prog?.progress || 0,
        githubUrl: prog?.github_url || null,
        demoUrl: prog?.demo_url || null,
        submissionNotes: prog?.notes || null
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch project details.' });
  }
}

export async function updateProjectProgress(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to track and submit project progress.' });
    }

    const { projectId, status = 'IN_PROGRESS', progress = 50, githubUrl, demoUrl, notes } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required.' });
    }

    const id = `pp-${userId}-${projectId}`;
    await execute(
      `INSERT INTO project_progress (id, user_id, project_id, status, progress, github_url, demo_url, notes, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, project_id)
       DO UPDATE SET status = $4, progress = $5, github_url = COALESCE($6, project_progress.github_url), demo_url = COALESCE($7, project_progress.demo_url), notes = COALESCE($8, project_progress.notes), updated_at = CURRENT_TIMESTAMP`,
      [id, userId, projectId, status, progress, githubUrl || null, demoUrl || null, notes || null]
    );

    return res.json({ message: 'Project status and submission updated successfully.' });
  } catch (err: any) {
    console.error('updateProjectProgress error:', err);
    return res.status(500).json({ error: 'Failed to update project progress.' });
  }
}
