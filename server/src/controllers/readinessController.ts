import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { computeCareerReadiness } from '../services/readinessService.ts';

export async function getReadinessScore(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({
        readiness: {
          totalScore: 0,
          level: 'Beginner',
          breakdown: {
            skillsScore: 0,
            projectsScore: 0,
            roadmapScore: 0,
            portfolioScore: 0
          },
          stats: {
            skillsCount: 0,
            projectsCompleted: 0,
            roadmapProgress: 0,
            savedCareersCount: 0
          },
          recommendedActions: [
            'Complete your career assessment to identify personalized target roles',
            'Log your first verified skill competency in the Skills catalog',
            'Start a portfolio project and build out your career milestones'
          ],
          isGuest: true
        }
      });
    }

    const readiness = await computeCareerReadiness(userId);
    return res.json({ readiness: { ...readiness, isGuest: false } });
  } catch (err: any) {
    console.error('getReadinessScore error:', err);
    return res.status(500).json({ error: 'Failed to compute career readiness.' });
  }
}
