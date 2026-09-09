import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { computeRecommendations } from '../services/recommendationService.ts';

export async function getRecommendations(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id || 'usr-student-01';
    const recommendations = await computeRecommendations(userId);
    return res.json({ recommendations });
  } catch (err: any) {
    console.error('getRecommendations error:', err);
    return res.status(500).json({ error: 'Failed to calculate career recommendations.' });
  }
}
