import { query, queryOne } from '../db/client.ts';

export interface RecommendationResult {
  careerId: string;
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  demandLevel: string;
  salaryMin: number;
  salaryMax: number;
  matchPercentage: number;
  reasons: string[];
  skillGaps: string[];
}

export async function computeRecommendations(userId: string): Promise<RecommendationResult[]> {
  // Fetch user profile and quiz answers
  const user = await queryOne('SELECT * FROM users WHERE id = $1', [userId]);
  const answers = await query(
    `SELECT qa.answer, qa.score, qq.category, qq.options, qq.weight
     FROM quiz_answers qa
     JOIN quiz_questions qq ON qa.question_id = qq.id
     WHERE qa.user_id = $1`,
    [userId]
  );

  // User skills
  const userSkillsRows = await query(
    `SELECT s.name, us.proficiency, us.progress
     FROM user_skills us
     JOIN skills s ON us.skill_id = s.id
     WHERE us.user_id = $1`,
    [userId]
  );
  const userSkillNames = new Set(userSkillsRows.map(r => r.name.toLowerCase()));

  // Fetch all careers
  const careers = await query('SELECT * FROM careers');

  // Category scores aggregated from quiz
  const categoryAffinities: Record<string, number> = {};
  const traitsDetected = new Set<string>();

  for (const ans of answers) {
    const opts = typeof ans.options === 'string' ? JSON.parse(ans.options) : ans.options;
    const selected = Array.isArray(opts) ? opts.find((o: any) => o.id === ans.answer) : null;
    if (selected) {
      if (selected.categoryAffinities) {
        for (const [cat, score] of Object.entries(selected.categoryAffinities)) {
          categoryAffinities[cat] = (categoryAffinities[cat] || 0) + ((score as number) * (ans.weight || 1));
        }
      }
      if (Array.isArray(selected.traits)) {
        selected.traits.forEach((t: string) => traitsDetected.add(t));
      }
    }
  }

  // Parse user interests
  const userInterests: string[] = user?.interests
    ? (typeof user.interests === 'string' ? JSON.parse(user.interests) : user.interests)
    : [];

  const results: RecommendationResult[] = [];

  for (const c of careers) {
    const careerSkills: string[] = typeof c.skills === 'string' ? JSON.parse(c.skills) : (c.skills || []);

    // 1. Interest Match (30%)
    let interestScore = 0;
    const catAffinity = categoryAffinities[c.category] || 0;
    if (userInterests.includes(c.category)) interestScore += 15;
    interestScore += Math.min(15, catAffinity * 3);
    interestScore = Math.min(30, interestScore);

    // 2. Skill Match (20%)
    let matchingSkillsCount = 0;
    const skillGaps: string[] = [];
    for (const sk of careerSkills) {
      if (userSkillNames.has(sk.toLowerCase())) {
        matchingSkillsCount++;
      } else {
        skillGaps.push(sk);
      }
    }
    const skillRatio = careerSkills.length > 0 ? (matchingSkillsCount / careerSkills.length) : 0.5;
    const skillScore = Math.min(20, skillRatio * 20 + 5); // baseline credit for transferable potential

    // 3. Work-style match (15%)
    let workStyleScore = 10;
    if (traitsDetected.has('Builder') && (c.category === 'Software' || c.category === 'Engineering')) workStyleScore += 5;
    if (traitsDetected.has('Investigative') && c.category === 'Cybersecurity') workStyleScore += 5;
    if (traitsDetected.has('Curious') && (c.category === 'AI & Data' || c.category === 'Research')) workStyleScore += 5;
    if (traitsDetected.has('Creative') && c.category === 'Design') workStyleScore += 5;
    workStyleScore = Math.min(15, workStyleScore);

    // 4. Goal match (15%)
    let goalScore = 10;
    if (c.demand_level === 'Very High') goalScore += 3;
    if (c.future_growth && c.future_growth.includes('+')) goalScore += 2;
    goalScore = Math.min(15, goalScore);

    // 5. Environment match (10%)
    let envScore = 8;
    if (user?.work_environment) {
      envScore += 2;
    }

    // 6. Learning preference (10%)
    let learningScore = 8;
    if (c.difficulty === 'Beginner') learningScore = 10;
    else if (c.difficulty === 'Intermediate') learningScore = 9;
    else learningScore = 8;

    const totalMatch = Math.min(98, Math.round(interestScore + skillScore + workStyleScore + goalScore + envScore + learningScore));

    const reasons: string[] = [
      `High alignment with your ${c.category} interests and problem-solving style`,
      `${matchingSkillsCount > 0 ? `Matches ${matchingSkillsCount} of your current verified competencies` : `Strong foundational overlap with your core strengths`}`,
      `Industry demand is currently ${c.demand_level} with ${c.future_growth}`
    ];

    results.push({
      careerId: c.id,
      title: c.title,
      slug: c.slug,
      category: c.category,
      difficulty: c.difficulty,
      demandLevel: c.demand_level,
      salaryMin: c.salary_min,
      salaryMax: c.salary_max,
      matchPercentage: Math.max(55, totalMatch),
      reasons,
      skillGaps: skillGaps.slice(0, 4)
    });
  }

// Sort descending by match percentage
  results.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return results.slice(0, 10);
}

export async function computeRecommendationsForAnswers(
  submittedAnswers: { questionId: string; answerId: string }[],
  userInterests: string[] = [],
  userSkills: string[] = []
): Promise<RecommendationResult[]> {
  const userSkillNames = new Set(userSkills.map(s => s.toLowerCase()));
  const questions = await query('SELECT id, category, options, weight FROM quiz_questions WHERE active = true');
  const questionMap = new Map(questions.map(q => [q.id, q]));

  const careers = await query('SELECT * FROM careers');
  const categoryAffinities: Record<string, number> = {};
  const traitsDetected = new Set<string>();

  for (const item of submittedAnswers) {
    const q = questionMap.get(item.questionId);
    if (!q) continue;

    const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
    const selected = Array.isArray(opts) ? opts.find((o: any) => o.id === item.answerId) : null;
    if (selected) {
      if (selected.categoryAffinities) {
        for (const [cat, score] of Object.entries(selected.categoryAffinities)) {
          categoryAffinities[cat] = (categoryAffinities[cat] || 0) + ((score as number) * (q.weight || 1));
        }
      }
      if (Array.isArray(selected.traits)) {
        selected.traits.forEach((t: string) => traitsDetected.add(t));
      }
    }
  }

  const results: RecommendationResult[] = [];

  for (const c of careers) {
    const careerSkills: string[] = typeof c.skills === 'string' ? JSON.parse(c.skills) : (c.skills || []);

    // 1. Interest Match (30%)
    let interestScore = 0;
    const catAffinity = categoryAffinities[c.category] || 0;
    if (userInterests.includes(c.category)) interestScore += 15;
    interestScore += Math.min(15, catAffinity * 3);
    interestScore = Math.min(30, interestScore);

    // 2. Skill Match (20%)
    let matchingSkillsCount = 0;
    const skillGaps: string[] = [];
    for (const sk of careerSkills) {
      if (userSkillNames.has(sk.toLowerCase())) {
        matchingSkillsCount++;
      } else {
        skillGaps.push(sk);
      }
    }
    const skillRatio = careerSkills.length > 0 ? (matchingSkillsCount / careerSkills.length) : 0.5;
    const skillScore = Math.min(20, skillRatio * 20 + 5);

    // 3. Work-style match (15%)
    let workStyleScore = 10;
    if (traitsDetected.has('Builder') && (c.category === 'Software' || c.category === 'Engineering')) workStyleScore += 5;
    if (traitsDetected.has('Investigative') && c.category === 'Cybersecurity') workStyleScore += 5;
    if (traitsDetected.has('Curious') && (c.category === 'AI & Data' || c.category === 'Research')) workStyleScore += 5;
    if (traitsDetected.has('Creative') && c.category === 'Design') workStyleScore += 5;
    workStyleScore = Math.min(15, workStyleScore);

    // 4. Goal match (15%)
    let goalScore = 10;
    if (c.demand_level === 'Very High') goalScore += 3;
    if (c.future_growth && c.future_growth.includes('+')) goalScore += 2;
    goalScore = Math.min(15, goalScore);

    // 5. Environment & Learning (20%)
    const envScore = 9;
    const learningScore = c.difficulty === 'Beginner' ? 10 : (c.difficulty === 'Intermediate' ? 9 : 8);

    const totalMatch = Math.min(98, Math.round(interestScore + skillScore + workStyleScore + goalScore + envScore + learningScore));

    const reasons: string[] = [
      `High alignment with your ${c.category} interests and problem-solving patterns`,
      `${matchingSkillsCount > 0 ? `Matches ${matchingSkillsCount} of your recognized competencies` : `Strong foundational overlap with your core cognitive traits`}`,
      `Industry demand is currently ${c.demand_level} with ${c.future_growth}`
    ];

    results.push({
      careerId: c.id,
      title: c.title,
      slug: c.slug,
      category: c.category,
      difficulty: c.difficulty,
      demandLevel: c.demand_level,
      salaryMin: c.salary_min,
      salaryMax: c.salary_max,
      matchPercentage: Math.max(55, totalMatch),
      reasons,
      skillGaps: skillGaps.slice(0, 4)
    });
  }

  results.sort((a, b) => b.matchPercentage - a.matchPercentage);
  return results.slice(0, 10);
}
