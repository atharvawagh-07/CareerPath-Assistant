import { Response } from 'express';
import { query, queryOne, execute } from '../db/client.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export async function getSkills(req: AuthenticatedRequest, res: Response) {
  try {
    const { category, difficulty, search } = req.query;

    let sql = 'SELECT * FROM skills WHERE 1=1';
    const params: any[] = [];

    if (category && typeof category === 'string' && category !== 'All') {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    if (difficulty && typeof difficulty === 'string' && difficulty !== 'All') {
      params.push(difficulty);
      sql += ` AND difficulty = $${params.length}`;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(description) LIKE $${params.length})`;
    }

    sql += ' ORDER BY name ASC';
    const rows = await query(sql, params);

    return res.json({ skills: rows });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch skills catalog.' });
  }
}

export async function getUserSkills(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ userSkills: [] });
    }

    const rows = await query(
      `SELECT us.*, s.name, s.category, s.difficulty, s.description
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1
       ORDER BY us.progress DESC, s.name ASC`,
      [userId]
    );

    return res.json({ userSkills: rows });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch user skills.' });
  }
}

export async function saveUserSkill(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to save skills.' });
    }
    const { skillId, proficiency = 'Beginner', progress = 20 } = req.body;

    if (!skillId) {
      return res.status(400).json({ error: 'Skill ID is required.' });
    }

    const id = `usk-${userId}-${skillId}`;
    await execute(
      `INSERT INTO user_skills (id, user_id, skill_id, proficiency, progress, updated_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, skill_id)
       DO UPDATE SET proficiency = $4, progress = $5, updated_at = CURRENT_TIMESTAMP`,
      [id, userId, skillId, proficiency, progress]
    );

    return res.json({ message: 'Skill proficiency updated successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update user skill.' });
  }
}

export async function deleteUserSkill(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to delete skills.' });
    }
    const { skillId } = req.params;

    await execute('DELETE FROM user_skills WHERE user_id = $1 AND skill_id = $2', [userId, skillId]);
    return res.json({ message: 'Skill removed from profile.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to remove skill.' });
  }
}
