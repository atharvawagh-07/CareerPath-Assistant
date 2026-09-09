import { Router } from 'express';
import { authenticateToken, optionalAuth, requireAdmin } from '../middleware/auth.ts';
import { rateLimit } from '../middleware/rateLimit.ts';

import * as authController from '../controllers/authController.ts';
import * as careerController from '../controllers/careerController.ts';
import * as quizController from '../controllers/quizController.ts';
import * as recommendationController from '../controllers/recommendationController.ts';
import * as roadmapController from '../controllers/roadmapController.ts';
import * as skillController from '../controllers/skillController.ts';
import * as projectController from '../controllers/projectController.ts';
import * as resourceController from '../controllers/resourceController.ts';
import * as savedController from '../controllers/savedController.ts';
import * as readinessController from '../controllers/readinessController.ts';
import * as feedbackController from '../controllers/feedbackController.ts';
import * as adminController from '../controllers/adminController.ts';

export const apiRouter = Router();

// Rate limiters for sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
  message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
});

const quizLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30,
  message: 'Assessment submission rate limit exceeded. Please wait a few moments before submitting again.'
});

// Health check
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'CareerPath API', timestamp: new Date().toISOString() });
});

// Auth routes
apiRouter.post('/auth/register', authLimiter, authController.register);
apiRouter.post('/auth/login', authLimiter, authController.login);
apiRouter.get('/auth/me', authenticateToken, authController.getMe);
apiRouter.put('/auth/profile', authenticateToken, authController.updateProfile);
apiRouter.post('/auth/forgot-password', authLimiter, authController.forgotPassword);

// Career routes
apiRouter.get('/careers', careerController.getCareers);
apiRouter.get('/careers/categories', careerController.getCareerCategories);
apiRouter.get('/careers/:slug', careerController.getCareerBySlug);
apiRouter.post('/careers', authenticateToken, requireAdmin, careerController.createCareer);
apiRouter.put('/careers/:id', authenticateToken, requireAdmin, careerController.updateCareer);
apiRouter.delete('/careers/:id', authenticateToken, requireAdmin, careerController.deleteCareer);

// Quiz assessment routes
apiRouter.get('/quiz/questions', optionalAuth, quizController.getQuizQuestions);
apiRouter.post('/quiz/submit', quizLimiter, optionalAuth, quizController.submitQuizAnswers);
apiRouter.get('/quiz/results', optionalAuth, quizController.getQuizResults);

// Recommendations
apiRouter.get('/recommendations', optionalAuth, recommendationController.getRecommendations);

// Career Roadmaps
apiRouter.get('/roadmaps', optionalAuth, roadmapController.getUserRoadmaps);
apiRouter.get('/roadmaps/:id', optionalAuth, roadmapController.getRoadmapById);
apiRouter.post('/roadmaps/generate/:careerId', authenticateToken, roadmapController.generateRoadmap);
apiRouter.put('/roadmaps/steps/:stepId/toggle', authenticateToken, roadmapController.toggleRoadmapStep);
apiRouter.delete('/roadmaps/:id', authenticateToken, roadmapController.deleteRoadmap);

// Skills catalog & user competencies
apiRouter.get('/skills', skillController.getSkills);
apiRouter.get('/skills/user', optionalAuth, skillController.getUserSkills);
apiRouter.post('/skills/user', authenticateToken, skillController.saveUserSkill);
apiRouter.delete('/skills/user/:skillId', authenticateToken, skillController.deleteUserSkill);

// Practical Projects
apiRouter.get('/projects', optionalAuth, projectController.getProjects);
apiRouter.get('/projects/:slug', optionalAuth, projectController.getProjectBySlug);
apiRouter.post('/projects/progress', authenticateToken, projectController.updateProjectProgress);

// Educational Resources
apiRouter.get('/resources', optionalAuth, resourceController.getResources);

// Saved Bookmarks
apiRouter.get('/saved/careers', optionalAuth, savedController.getSavedCareers);
apiRouter.post('/saved/careers/:careerId', authenticateToken, savedController.toggleSaveCareer);
apiRouter.get('/saved/resources', optionalAuth, savedController.getSavedResources);
apiRouter.post('/saved/resources/:resourceId', authenticateToken, savedController.toggleSaveResource);

// Career Readiness Index
apiRouter.get('/readiness', optionalAuth, readinessController.getReadinessScore);

// Feedback
apiRouter.post('/feedback', optionalAuth, feedbackController.submitFeedback);
apiRouter.get('/feedback', authenticateToken, requireAdmin, feedbackController.getFeedbackList);
apiRouter.put('/feedback/:id/status', authenticateToken, requireAdmin, feedbackController.updateFeedbackStatus);

// Admin platform management
apiRouter.get('/admin/stats', authenticateToken, requireAdmin, adminController.getAdminStats);
apiRouter.get('/admin/users', authenticateToken, requireAdmin, adminController.getAdminUsers);
apiRouter.put('/admin/users/:id/role', authenticateToken, requireAdmin, adminController.updateUserRole);
