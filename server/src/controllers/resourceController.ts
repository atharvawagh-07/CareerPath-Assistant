import { Response } from 'express';
import { query, queryOne } from '../db/client.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export async function getResources(req: AuthenticatedRequest, res: Response) {
  try {
    const { category, difficulty, isFree, search } = req.query;
    const userId = req.user?.id || 'usr-student-01';

    let sql = 'SELECT * FROM resources WHERE 1=1';
    const params: any[] = [];

    if (category && typeof category === 'string' && category !== 'All') {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    if (difficulty && typeof difficulty === 'string' && difficulty !== 'All') {
      params.push(difficulty);
      sql += ` AND difficulty = $${params.length}`;
    }

    if (isFree !== undefined && isFree !== 'All') {
      params.push(isFree === 'true');
      sql += ` AND is_free = $${params.length}`;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(description) LIKE $${params.length} OR LOWER(provider) LIKE $${params.length})`;
    }

    sql += ' ORDER BY provider ASC, title ASC';
    const rows = await query(sql, params);

    // Check user's saved resources
    const savedRows = await query('SELECT resource_id FROM saved_resources WHERE user_id = $1', [userId]);
    const savedSet = new Set(savedRows.map(r => r.resource_id));

    const formatted = rows.map(r => ({
      ...r,
      isSaved: savedSet.has(r.id)
    }));

    return res.json({ resources: formatted });
  } catch (err: any) {
    console.error('getResources error:', err);
    return res.status(500).json({ error: 'Failed to fetch educational resources.' });
  }
}
