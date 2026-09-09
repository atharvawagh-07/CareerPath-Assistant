import { Response } from 'express';
import { query, queryOne, execute } from '../db/client.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export async function submitFeedback(req: AuthenticatedRequest, res: Response) {
  try {
    const { name, email, message, type = 'GENERAL' } = req.body;
    const userId = req.user?.id || null;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const id = `fb-${Date.now()}`;
    await execute(
      `INSERT INTO feedback (id, user_id, name, email, message, type, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')`,
      [id, userId, name.trim(), email.toLowerCase().trim(), message.trim(), type]
    );

    return res.status(201).json({ message: 'Thank you! Your feedback has been received.' });
  } catch (err: any) {
    console.error('submitFeedback error:', err);
    return res.status(500).json({ error: 'Failed to record feedback.' });
  }
}

export async function getFeedbackList(req: AuthenticatedRequest, res: Response) {
  try {
    const rows = await query('SELECT * FROM feedback ORDER BY created_at DESC');
    return res.json({ feedback: rows });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load feedback list.' });
  }
}

export async function updateFeedbackStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await execute('UPDATE feedback SET status = $1 WHERE id = $2', [status, id]);
    return res.json({ message: 'Feedback status updated.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update feedback status.' });
  }
}
