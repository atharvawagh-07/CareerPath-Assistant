import { Request, Response } from 'express';
import { query, queryOne, execute } from '../db/client.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export async function getCareers(req: Request, res: Response) {
  try {
    const { search, category, difficulty, demandLevel, sort, page = '1', limit = '12' } = req.query;

    let whereClause = ' WHERE 1=1';
    const params: any[] = [];

    if (search && typeof search === 'string' && search.trim() !== '') {
      params.push(`%${search.trim().toLowerCase()}%`);
      whereClause += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(description) LIKE $${params.length} OR LOWER(category) LIKE $${params.length})`;
    }

    if (category && typeof category === 'string' && category !== 'All') {
      params.push(category);
      whereClause += ` AND category = $${params.length}`;
    }

    if (difficulty && typeof difficulty === 'string' && difficulty !== 'All') {
      params.push(difficulty);
      whereClause += ` AND difficulty = $${params.length}`;
    }

    if (demandLevel && typeof demandLevel === 'string' && demandLevel !== 'All') {
      params.push(demandLevel);
      whereClause += ` AND demand_level = $${params.length}`;
    }

    // Sorting
    let orderClause = ' ORDER BY demand_level DESC, title ASC';
    if (sort === 'salary_desc') {
      orderClause = ' ORDER BY salary_max DESC';
    } else if (sort === 'salary_asc') {
      orderClause = ' ORDER BY salary_min ASC';
    } else if (sort === 'title_asc') {
      orderClause = ' ORDER BY title ASC';
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 12));
    const offset = (pageNum - 1) * limitNum;

    // Count query
    const countRes = await query(`SELECT COUNT(*) as count FROM careers ${whereClause}`, params);
    const totalCount = parseInt(countRes[0]?.count || '0', 10);

    const rows = await query(`SELECT * FROM careers ${whereClause} ${orderClause} LIMIT ${limitNum} OFFSET ${offset}`, params);

    const formatted = rows.map(c => ({
      ...c,
      responsibilities: typeof c.responsibilities === 'string' ? JSON.parse(c.responsibilities) : c.responsibilities,
      skills: typeof c.skills === 'string' ? JSON.parse(c.skills) : c.skills,
      tools: typeof c.tools === 'string' ? JSON.parse(c.tools) : c.tools,
      industries: typeof c.industries === 'string' ? JSON.parse(c.industries) : c.industries,
      pros: typeof c.pros === 'string' ? JSON.parse(c.pros) : c.pros,
      cons: typeof c.cons === 'string' ? JSON.parse(c.cons) : c.cons,
    }));

    return res.json({
      careers: formatted,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum)
      }
    });
  } catch (err: any) {
    console.error('getCareers error:', err);
    return res.status(500).json({ error: 'Failed to fetch careers.', details: err?.message || String(err) });
  }
}

export async function getCareerCategories(req: Request, res: Response) {
  try {
    const rows = await query('SELECT DISTINCT category, count(*) as count FROM careers GROUP BY category ORDER BY category ASC');
    return res.json({ categories: rows });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch career categories.' });
  }
}

export async function getCareerBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const career = await queryOne('SELECT * FROM careers WHERE slug = $1', [slug]);
    if (!career) {
      return res.status(404).json({ error: 'Career path not found.' });
    }

    // Fetch associated skills
    const skillsRows = await query(
      `SELECT s.id, s.name, s.category, s.difficulty, s.description
       FROM career_skills cs
       JOIN skills s ON cs.skill_id = s.id
       WHERE cs.career_id = $1`,
      [career.id]
    );

    // Fetch related projects
    const projectsRows = await query(
      `SELECT id, title, slug, difficulty, duration, portfolio_value, technologies
       FROM projects
       WHERE category = $1
       LIMIT 4`,
      [career.category]
    );

    // Fetch related resources
    const resourcesRows = await query(
      `SELECT id, title, description, category, difficulty, is_free, url, provider
       FROM resources
       LIMIT 6`
    );

    const formatted = {
      ...career,
      responsibilities: typeof career.responsibilities === 'string' ? JSON.parse(career.responsibilities) : career.responsibilities,
      skills: typeof career.skills === 'string' ? JSON.parse(career.skills) : career.skills,
      tools: typeof career.tools === 'string' ? JSON.parse(career.tools) : career.tools,
      industries: typeof career.industries === 'string' ? JSON.parse(career.industries) : career.industries,
      pros: typeof career.pros === 'string' ? JSON.parse(career.pros) : career.pros,
      cons: typeof career.cons === 'string' ? JSON.parse(career.cons) : career.cons,
      verifiedSkills: skillsRows,
      recommendedProjects: projectsRows.map(p => ({
        ...p,
        technologies: typeof p.technologies === 'string' ? JSON.parse(p.technologies) : p.technologies
      })),
      recommendedResources: resourcesRows
    };

    return res.json({ career: formatted });
  } catch (err: any) {
    console.error('getCareerBySlug error:', err);
    return res.status(500).json({ error: 'Failed to fetch career details.' });
  }
}

export async function createCareer(req: AuthenticatedRequest, res: Response) {
  try {
    const {
      title, slug, category, description, overview, responsibilities, education,
      difficulty, demandLevel, futureGrowth, salaryMin, salaryMax, skills, tools, industries, pros, cons
    } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ error: 'Title, category, and description are required.' });
    }

    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = `car-${Date.now()}`;

    await execute(
      `INSERT INTO careers (id, title, slug, category, description, overview, responsibilities, education, difficulty, demand_level, future_growth, salary_min, salary_max, skills, tools, industries, pros, cons)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
      [
        id, title, finalSlug, category, description, overview || description,
        JSON.stringify(responsibilities || []), education || 'Relevant degree or portfolio',
        difficulty || 'Intermediate', demandLevel || 'High', futureGrowth || '+15% growth',
        parseInt(salaryMin, 10) || 75000, parseInt(salaryMax, 10) || 135000,
        JSON.stringify(skills || []), JSON.stringify(tools || []), JSON.stringify(industries || []),
        JSON.stringify(pros || []), JSON.stringify(cons || [])
      ]
    );

    const created = await queryOne('SELECT * FROM careers WHERE id = $1', [id]);
    return res.status(201).json({ message: 'Career created successfully.', career: created });
  } catch (err: any) {
    console.error('createCareer error:', err);
    return res.status(500).json({ error: 'Failed to create career.' });
  }
}

export async function updateCareer(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const {
      title, category, description, overview, education,
      difficulty, demandLevel, futureGrowth, salaryMin, salaryMax
    } = req.body;

    await execute(
      `UPDATE careers
       SET title = COALESCE($1, title),
           category = COALESCE($2, category),
           description = COALESCE($3, description),
           overview = COALESCE($4, overview),
           education = COALESCE($5, education),
           difficulty = COALESCE($6, difficulty),
           demand_level = COALESCE($7, demand_level),
           future_growth = COALESCE($8, future_growth),
           salary_min = COALESCE($9, salary_min),
           salary_max = COALESCE($10, salary_max),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $11`,
      [
        title, category, description, overview, education,
        difficulty, demandLevel, futureGrowth,
        salaryMin ? parseInt(salaryMin, 10) : null,
        salaryMax ? parseInt(salaryMax, 10) : null,
        id
      ]
    );

    const updated = await queryOne('SELECT * FROM careers WHERE id = $1', [id]);
    return res.json({ message: 'Career updated successfully.', career: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update career.' });
  }
}

export async function deleteCareer(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    await execute('DELETE FROM careers WHERE id = $1', [id]);
    return res.json({ message: 'Career deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete career.' });
  }
}
