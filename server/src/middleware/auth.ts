import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

let resolvedSecret = process.env.JWT_SECRET;
if (!resolvedSecret || resolvedSecret === 'super-secret-jwt-key-for-careerpath') {
  if (process.env.NODE_ENV === 'production') {
    console.warn('[SECURITY] Generating secure ephemeral JWT secret for this session to prevent known default secret attacks.');
  }
  resolvedSecret = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
}

export const JWT_SECRET = resolvedSecret;

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired session token.' });
  }
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
      req.user = decoded;
    } catch (err) {
      // Ignore invalid token for optional auth
    }
  }
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Administrative privileges required.' });
  }
  next();
}
