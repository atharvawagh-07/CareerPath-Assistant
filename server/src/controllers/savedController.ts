import { Response } from 'express';
import { query, queryOne, execute } from '../db/client.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export async function getSavedCareers(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ savedCareers: [] });
    }

    const rows = await query(
      `SELECT c.*, sc.created_at as saved_at
       FROM saved_careers sc
       JOIN careers c ON sc.career_id = c.id
       WHERE sc.user_id = $1
       ORDER BY sc.created_at DESC`,
      [userId]
    );

    const formatted = rows.map(c => ({
      ...c,
      responsibilities: typeof c.responsibilities === 'string' ? JSON.parse(c.responsibilities) : c.responsibilities,
      skills: typeof c.skills === 'string' ? JSON.parse(c.skills) : c.skills,
      tools: typeof c.tools === 'string' ? JSON.parse(c.tools) : c.tools,
      industries: typeof c.industries === 'string' ? JSON.parse(c.industries) : c.industries,
      pros: typeof c.pros === 'string' ? JSON.parse(c.pros) : c.pros,
      cons: typeof c.cons === 'string' ? JSON.parse(c.cons) : c.cons
    }));

    return res.json({ savedCareers: formatted });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch saved career bookmarks.' });
  }
}

export async function toggleSaveCareer(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to save bookmarks.' });
    }
    const { careerId } = req.params;

    const existing = await queryOne(
      'SELECT id FROM saved_careers WHERE user_id = $1 AND career_id = $2',
      [userId, careerId]
    );

    if (existing) {
      await execute('DELETE FROM saved_careers WHERE user_id = $1 AND career_id = $2', [userId, careerId]);
      return res.json({ message: 'Career removed from bookmarks.', isSaved: false });
    } else {
      const id = `sc-${Date.now()}`;
      await execute(
        'INSERT INTO saved_careers (id, user_id, career_id) VALUES ($1, $2, $3)',
        [id, userId, careerId]
      );
      return res.json({ message: 'Career saved to bookmarks.', isSaved: true });
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update career bookmark.' });
  }
}

export async function getSavedResources(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ savedResources: [] });
    }

    const rows = await query(
      `SELECT r.*, sr.created_at as saved_at
       FROM saved_resources sr
       JOIN resources r ON sr.resource_id = r.id
       WHERE sr.user_id = $1
       ORDER BY sr.created_at DESC`,
      [userId]
    );

    return res.json({ savedResources: rows });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch saved resources.' });
  }
}

export async function toggleSaveResource(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to save resources.' });
    }
    const { resourceId } = req.params;

    const existing = await queryOne(
      'SELECT id FROM saved_resources WHERE user_id = $1 AND resource_id = $2',
      [userId, resourceId]
    );

    if (existing) {
      await execute('DELETE FROM saved_resources WHERE user_id = $1 AND resource_id = $2', [userId, resourceId]);
      return res.json({ message: 'Resource removed from bookmarks.', isSaved: false });
    } else {
      const id = `sr-${Date.now()}`;
      await execute(
        'INSERT INTO saved_resources (id, user_id, resource_id) VALUES ($1, $2, $3)',
        [id, userId, resourceId]
      );
      return res.json({ message: 'Resource saved to bookmarks.', isSaved: true });
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update resource bookmark.' });
  }
}
