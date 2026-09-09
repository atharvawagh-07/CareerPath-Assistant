import { query, queryOne } from '../db/client.ts';

export interface ReadinessScoreResult {
  totalScore: number;
  level: 'Beginner' | 'Developing' | 'Job Ready';
  breakdown: {
    skillsScore: number;
    projectsScore: number;
    roadmapScore: number;
    portfolioScore: number;
  };
  stats: {
    skillsCount: number;
    projectsCompleted: number;
    roadmapProgress: number;
    savedCareersCount: number;
  };
  recommendedActions: string[];
}

export async function computeCareerReadiness(userId: string): Promise<ReadinessScoreResult> {
  // 1. Skills: up to 25 points
  const userSkills = await query(
    `SELECT proficiency, progress FROM user_skills WHERE user_id = $1`,
    [userId]
  );
  let skillsScore = 0;
  if (userSkills.length > 0) {
    let skillPoints = 0;
    for (const sk of userSkills) {
      if (sk.proficiency === 'Advanced') skillPoints += 5;
      else if (sk.proficiency === 'Intermediate') skillPoints += 3;
      else skillPoints += 1.5;
    }
    skillsScore = Math.min(25, Math.round(skillPoints * 2));
  }

  // 2. Projects: up to 25 points
  const projects = await query(
    `SELECT status, progress FROM project_progress WHERE user_id = $1`,
    [userId]
  );
  let completedProjects = 0;
  let inProgressProjects = 0;
  for (const pr of projects) {
    if (pr.status === 'COMPLETED' || pr.progress >= 100) completedProjects++;
    else if (pr.status === 'IN_PROGRESS' || pr.progress > 0) inProgressProjects++;
  }
  let projectsScore = Math.min(25, (completedProjects * 10) + (inProgressProjects * 4));

  // 3. Roadmap: up to 30 points
  const roadmaps = await query(
    `SELECT r.progress, COUNT(rs.id) as total_steps, SUM(CASE WHEN rs.completed THEN 1 ELSE 0 END) as completed_steps
     FROM roadmaps r
     LEFT JOIN roadmap_steps rs ON r.id = rs.roadmap_id
     WHERE r.user_id = $1
     GROUP BY r.id, r.progress`,
    [userId]
  );
  let roadmapScore = 0;
  let avgRoadmapProgress = 0;
  if (roadmaps.length > 0) {
    let totalProgress = 0;
    for (const rm of roadmaps) {
      const stepProg = rm.total_steps > 0 ? (Number(rm.completed_steps) / Number(rm.total_steps)) * 100 : Number(rm.progress);
      totalProgress += stepProg;
    }
    avgRoadmapProgress = Math.round(totalProgress / roadmaps.length);
    roadmapScore = Math.min(30, Math.round((avgRoadmapProgress / 100) * 30));
  }

  // 4. Portfolio: up to 20 points
  const savedCareers = await query('SELECT id FROM saved_careers WHERE user_id = $1', [userId]);
  const user = await queryOne('SELECT education_level, institution, career_goals FROM users WHERE id = $1', [userId]);

  let portfolioScore = 5; // baseline registration
  if (user?.education_level) portfolioScore += 3;
  if (user?.career_goals) portfolioScore += 4;
  if (savedCareers.length > 0) portfolioScore += 4;
  if (completedProjects > 0) portfolioScore += 4;
  portfolioScore = Math.min(20, portfolioScore);

  const totalScore = Math.min(100, Math.round(skillsScore + projectsScore + roadmapScore + portfolioScore));

  let level: 'Beginner' | 'Developing' | 'Job Ready' = 'Beginner';
  if (totalScore >= 75) level = 'Job Ready';
  else if (totalScore >= 40) level = 'Developing';

  const recommendedActions: string[] = [];
  if (skillsScore < 15) {
    recommendedActions.push('Assess and verify at least 3 more core technical skills on your profile.');
  }
  if (projectsScore < 15) {
    recommendedActions.push('Start a guided portfolio project from the Projects catalog to validate your practical craftsmanship.');
  }
  if (roadmapScore < 18) {
    recommendedActions.push('Mark off your completed milestones on your active Career Roadmap.');
  }
  if (savedCareers.length === 0) {
    recommendedActions.push('Save 2-3 target careers to track and compare their salary and difficulty metrics.');
  }
  if (recommendedActions.length === 0) {
    recommendedActions.push('Prepare for technical and behavioral interviews using the curated interview preparation guide.');
  }

  return {
    totalScore,
    level,
    breakdown: {
      skillsScore,
      projectsScore,
      roadmapScore,
      portfolioScore
    },
    stats: {
      skillsCount: userSkills.length,
      projectsCompleted: completedProjects,
      roadmapProgress: avgRoadmapProgress,
      savedCareersCount: savedCareers.length
    },
    recommendedActions
  };
}
