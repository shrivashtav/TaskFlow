const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * @desc    Get all projects for current user (with search & task counts)
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { search } = req.query;

    let query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.created_by,
        p.created_at,
        p.updated_at,
        COUNT(t.id) AS total_tasks,
        SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_tasks
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE p.created_by = ?
    `;
    const params = [userId];

    if (search && search.trim()) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      const searchPattern = `%${search.trim()}%`;
      params.push(searchPattern, searchPattern);
    }

    query += ` GROUP BY p.id ORDER BY p.updated_at DESC, p.created_at DESC`;

    const [rows] = await pool.query(query, params);

    const formatted = rows.map(proj => ({
      ...proj,
      total_tasks: Number(proj.total_tasks || 0),
      completed_tasks: Number(proj.completed_tasks || 0)
    }));

    return sendSuccess(res, 200, 'Projects retrieved successfully', formatted);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProjectById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT 
        p.id,
        p.name,
        p.description,
        p.created_by,
        p.created_at,
        p.updated_at,
        COUNT(t.id) AS total_tasks,
        SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_tasks
       FROM projects p
       LEFT JOIN tasks t ON p.id = t.project_id
       WHERE p.id = ? AND p.created_by = ?
       GROUP BY p.id`,
      [id, userId]
    );

    if (rows.length === 0) {
      return sendError(res, 404, 'Project not found');
    }

    const project = {
      ...rows[0],
      total_tasks: Number(rows[0].total_tasks || 0),
      completed_tasks: Number(rows[0].completed_tasks || 0)
    };

    return sendSuccess(res, 200, 'Project retrieved successfully', project);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return sendError(res, 400, 'Project name is required');
    }

    const trimmedName = name.trim();
    const trimmedDescription = description ? description.trim() : null;

    const [result] = await pool.query(
      'INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)',
      [trimmedName, trimmedDescription, userId]
    );

    const newProjectId = result.insertId;

    const [newProjectRows] = await pool.query(
      'SELECT id, name, description, created_by, created_at, updated_at FROM projects WHERE id = ?',
      [newProjectId]
    );

    const project = {
      ...newProjectRows[0],
      total_tasks: 0,
      completed_tasks: 0
    };

    return sendSuccess(res, 201, 'Project created successfully', project);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private
 */
const updateProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return sendError(res, 400, 'Project name is required');
    }

    // Check project ownership
    const [existing] = await pool.query(
      'SELECT id FROM projects WHERE id = ? AND created_by = ?',
      [id, userId]
    );

    if (existing.length === 0) {
      return sendError(res, 404, 'Project not found');
    }

    const trimmedName = name.trim();
    const trimmedDescription = description !== undefined ? (description ? description.trim() : null) : undefined;

    if (trimmedDescription !== undefined) {
      await pool.query(
        'UPDATE projects SET name = ?, description = ? WHERE id = ? AND created_by = ?',
        [trimmedName, trimmedDescription, id, userId]
      );
    } else {
      await pool.query(
        'UPDATE projects SET name = ? WHERE id = ? AND created_by = ?',
        [trimmedName, id, userId]
      );
    }

    // Return updated project
    const [updatedRows] = await pool.query(
      `SELECT 
        p.id,
        p.name,
        p.description,
        p.created_by,
        p.created_at,
        p.updated_at,
        COUNT(t.id) AS total_tasks,
        SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_tasks
       FROM projects p
       LEFT JOIN tasks t ON p.id = t.project_id
       WHERE p.id = ? AND p.created_by = ?
       GROUP BY p.id`,
      [id, userId]
    );

    const project = {
      ...updatedRows[0],
      total_tasks: Number(updatedRows[0].total_tasks || 0),
      completed_tasks: Number(updatedRows[0].completed_tasks || 0)
    };

    return sendSuccess(res, 200, 'Project updated successfully', project);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete project (cascades tasks)
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
const deleteProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [existing] = await pool.query(
      'SELECT id FROM projects WHERE id = ? AND created_by = ?',
      [id, userId]
    );

    if (existing.length === 0) {
      return sendError(res, 404, 'Project not found');
    }

    await pool.query('DELETE FROM projects WHERE id = ? AND created_by = ?', [id, userId]);

    return sendSuccess(res, 200, 'Project and associated tasks deleted successfully', { id: Number(id) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
