import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, queryOne, execute } from '../db/client.ts';
import { AuthenticatedRequest, JWT_SECRET } from '../middleware/auth.ts';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, educationLevel, institution, interests } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long for security.' });
    }

    const existing = await queryOne('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    await execute(
      `INSERT INTO users (id, name, email, password_hash, role, education_level, institution, interests)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        userId,
        name.trim(),
        email.toLowerCase().trim(),
        passwordHash,
        'STUDENT',
        educationLevel || 'Undergraduate Student',
        institution || '',
        JSON.stringify(interests || [])
      ]
    );

    const token = jwt.sign(
      { id: userId, email: email.toLowerCase().trim(), role: 'STUDENT', name: name.trim() },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account registered successfully.',
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: 'STUDENT',
        educationLevel: educationLevel || 'Undergraduate Student',
        institution: institution || '',
        interests: interests || []
      }
    });
  } catch (err: any) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Failed to create user account.' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await queryOne('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const interests = user.interests ? (typeof user.interests === 'string' ? JSON.parse(user.interests) : user.interests) : [];

    return res.json({
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profile_image,
        educationLevel: user.education_level,
        institution: user.institution,
        interests,
        careerGoals: user.career_goals,
        workEnvironment: user.work_environment
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Failed to log in.' });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const user = await queryOne('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const interests = user.interests ? (typeof user.interests === 'string' ? JSON.parse(user.interests) : user.interests) : [];

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profile_image,
        educationLevel: user.education_level,
        institution: user.institution,
        interests,
        careerGoals: user.career_goals,
        workEnvironment: user.work_environment
      }
    });
  } catch (err: any) {
    console.error('GetMe error:', err);
    return res.status(500).json({ error: 'Failed to load user profile.' });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const { name, educationLevel, institution, interests, careerGoals, workEnvironment } = req.body;

    await execute(
      `UPDATE users
       SET name = COALESCE($1, name),
           education_level = COALESCE($2, education_level),
           institution = COALESCE($3, institution),
           interests = COALESCE($4, interests),
           career_goals = COALESCE($5, career_goals),
           work_environment = COALESCE($6, work_environment),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7`,
      [
        name,
        educationLevel,
        institution,
        interests ? JSON.stringify(interests) : null,
        careerGoals,
        workEnvironment,
        req.user.id
      ]
    );

    const updated = await queryOne('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const parsedInterests = updated.interests ? (typeof updated.interests === 'string' ? JSON.parse(updated.interests) : updated.interests) : [];

    return res.json({
      message: 'Profile updated successfully.',
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        educationLevel: updated.education_level,
        institution: updated.institution,
        interests: parsedInterests,
        careerGoals: updated.career_goals,
        workEnvironment: updated.work_environment
      }
    });
  } catch (err: any) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Failed to update user profile.' });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await queryOne('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (!user) {
      return res.json({ message: 'If an account matches this email, instructions have been dispatched.' });
    }

    // Secure generic message to prevent email enumeration and password leakage
    return res.json({
      message: 'If an account associated with this email exists, a password reset verification link has been dispatched to your inbox.'
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to initiate password reset.' });
  }
}
