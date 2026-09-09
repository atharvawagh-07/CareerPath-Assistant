import { Response } from 'express';
import { query, queryOne, execute } from '../db/client.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { computeRecommendations, computeRecommendationsForAnswers } from '../services/recommendationService.ts';

export async function getQuizQuestions(req: AuthenticatedRequest, res: Response) {
  try {
    const rows = await query('SELECT * FROM quiz_questions WHERE active = true ORDER BY display_order ASC');
    const formatted = rows.map(q => ({
      id: q.id,
      question: q.question,
      category: q.category,
      weight: q.weight,
      order: q.display_order,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    }));

    return res.json({ questions: formatted });
  } catch (err: any) {
    console.error('getQuizQuestions error:', err);
    return res.status(500).json({ error: 'Failed to retrieve assessment questions.' });
  }
}

export async function submitQuizAnswers(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { answers } = req.body; // Array of { questionId: string, answerId: string }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Valid array of question answers is required.' });
    }

    // Guest submission: evaluate in-memory without polluting or deleting database user states
    if (!userId) {
      const recommendations = await computeRecommendationsForAnswers(answers);
      const topCareer = recommendations[0];
      return res.json({
        message: 'Assessment completed successfully.',
        resultId: `guest-${Date.now()}`,
        recommendations,
        topCareer,
        isGuest: true
      });
    }

    // Authenticated user submission: persist to the user's private account
    await execute('DELETE FROM quiz_answers WHERE user_id = $1', [userId]);

    for (const a of answers) {
      const ansId = `ans-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      await execute(
        `INSERT INTO quiz_answers (id, user_id, question_id, answer, score)
         VALUES ($1, $2, $3, $4, $5)`,
        [ansId, userId, a.questionId, a.answerId, 1.0]
      );
    }

    // Calculate recommendations for authenticated user
    const recommendations = await computeRecommendations(userId);
    const topCareer = recommendations[0];

    // Persist recommendations
    await execute('DELETE FROM career_recommendations WHERE user_id = $1', [userId]);
    for (const rec of recommendations) {
      const recId = `cr-${userId}-${rec.careerId}`;
      await execute(
        `INSERT INTO career_recommendations (id, user_id, career_id, match_percentage, reasons)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id, career_id) DO UPDATE SET match_percentage = $4, reasons = $5`,
        [recId, userId, rec.careerId, rec.matchPercentage, JSON.stringify(rec.reasons)]
      );
    }

    // Save Quiz Result snapshot
    const resultId = `qres-${Date.now()}`;
    const resultPayload = {
      completedAt: new Date().toISOString(),
      totalAnswered: answers.length,
      topCategory: topCareer?.category || 'Software',
      topCareerId: topCareer?.careerId,
      topCareerTitle: topCareer?.title
    };

    await execute(
      `INSERT INTO quiz_results (id, user_id, result_data, top_career_id)
       VALUES ($1, $2, $3, $4)`,
      [resultId, userId, JSON.stringify(resultPayload), topCareer?.careerId || null]
    );

    return res.json({
      message: 'Assessment completed and saved to your profile.',
      resultId,
      recommendations,
      topCareer,
      isGuest: false
    });
  } catch (err: any) {
    console.error('submitQuizAnswers error:', err);
    return res.status(500).json({ error: 'Failed to process assessment results.' });
  }
}

export async function getQuizResults(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.json({
        hasCompletedQuiz: false,
        latestResult: null,
        recommendations: [],
        isGuest: true
      });
    }

    const latestResult = await queryOne(
      `SELECT * FROM quiz_results WHERE user_id = $1 ORDER BY completed_at DESC LIMIT 1`,
      [userId]
    );

    const recommendations = await computeRecommendations(userId);

    return res.json({
      hasCompletedQuiz: !!latestResult,
      latestResult: latestResult ? {
        ...latestResult,
        result_data: typeof latestResult.result_data === 'string' ? JSON.parse(latestResult.result_data) : latestResult.result_data
      } : null,
      recommendations,
      isGuest: false
    });
  } catch (err: any) {
    console.error('getQuizResults error:', err);
    return res.status(500).json({ error: 'Failed to retrieve assessment history.' });
  }
}
