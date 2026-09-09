import { Response } from 'express';
import { query, queryOne, execute } from '../db/client.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export async function getAdminStats(req: AuthenticatedRequest, res: Response) {
  try {
    const usersCountRes = await query('SELECT count(*) as count FROM users');
    const studentCountRes = await query("SELECT count(*) as count FROM users WHERE role = 'STUDENT'");
    const careersCountRes = await query('SELECT count(*) as count FROM careers');
    const skillsCountRes = await query('SELECT count(*) as count FROM skills');
    const quizCompletionsRes = await query('SELECT count(*) as count FROM quiz_results');
    const activeRoadmapsRes = await query('SELECT count(*) as count FROM roadmaps');
    const projectsCountRes = await query('SELECT count(*) as count FROM projects');
    const feedbackCountRes = await query('SELECT count(*) as count FROM feedback');

    // Most popular careers bookmarked
    const topSavedCareers = await query(
      `SELECT c.title, c.category, count(sc.id) as save_count
       FROM saved_careers sc
       JOIN careers c ON sc.career_id = c.id
       GROUP BY c.id, c.title, c.category
       ORDER BY save_count DESC
       LIMIT 5`
    );

    // Distribution by category
    const categoryDistribution = await query(
      `SELECT category, count(*) as count FROM careers GROUP BY category ORDER BY count DESC`
    );

    return res.json({
      stats: {
        totalUsers: parseInt(usersCountRes[0]?.count || '0', 10),
        totalStudents: parseInt(studentCountRes[0]?.count || '0', 10),
        totalCareers: parseInt(careersCountRes[0]?.count || '0', 10),
        totalSkills: parseInt(skillsCountRes[0]?.count || '0', 10),
        quizCompletions: parseInt(quizCompletionsRes[0]?.count || '0', 10),
        activeRoadmaps: parseInt(activeRoadmapsRes[0]?.count || '0', 10),
        totalProjects: parseInt(projectsCountRes[0]?.count || '0', 10),
        feedbackCount: parseInt(feedbackCountRes[0]?.count || '0', 10),
        topSavedCareers,
        categoryDistribution
      }
    });
  } catch (err: any) {
    console.error('getAdminStats error:', err);
    return res.status(500).json({ error: 'Failed to fetch admin platform analytics.' });
  }
}

export async function getAdminUsers(req: AuthenticatedRequest, res: Response) {
  try {
    const rows = await query(
      `SELECT id, name, email, role, education_level, institution, created_at, updated_at
       FROM users
       ORDER BY created_at DESC`
    );
    return res.json({ users: rows });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch users list.' });
  }
}

export async function updateUserRole(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['STUDENT', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Role must be STUDENT or ADMIN.' });
    }

    await execute('UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [role, id]);
    return res.json({ message: 'User role updated.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update user role.' });
  }
}
