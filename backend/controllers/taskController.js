const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

/**
 * Helper: Verify that the project belongs to the user
 */
const verifyProjectOwnership = async (projectId, userId) => {
  const [rows] = await pool.query(
    'SELECT id FROM projects WHERE id = ? AND created_by = ?',
    [projectId, userId]
  );
  return rows.length > 0;
};

/**
 * @desc    Get tasks for a specific project with search and filters
 * @route   GET /api/projects/:projectId/tasks?search=&status=&priority=
 * @access  Private
 */
const getTasksByProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;
    const { search, status, priority } = req.query;

    const isOwner = await verifyProjectOwnership(projectId, userId);
    if (!isOwner) {
      return sendError(res, 404, 'Project not found');
    }

    let query = `
      SELECT 
        id, 
        project_id, 
        title, 
        description, 
        status, 
        priority, 
        DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date, 
        assigned_to, 
        created_at, 
        updated_at 
      FROM tasks 
      WHERE project_id = ?
    `;
    const params = [projectId];

    if (search && search.trim()) {
      query += ` AND (title LIKE ? OR description LIKE ? OR assigned_to LIKE ?)`;
      const pattern = `%${search.trim()}%`;
      params.push(pattern, pattern, pattern);
    }

    if (status && VALID_STATUSES.includes(status.toUpperCase())) {
      query += ` AND status = ?`;
      params.push(status.toUpperCase());
    }

    if (priority && VALID_PRIORITIES.includes(priority.toUpperCase())) {
      query += ` AND priority = ?`;
      params.push(priority.toUpperCase());
    }

    query += ` ORDER BY 
      CASE status 
        WHEN 'TODO' THEN 1 
        WHEN 'IN_PROGRESS' THEN 2 
        WHEN 'COMPLETED' THEN 3 
      END,
      due_date ASC, 
      created_at DESC`;

    const [tasks] = await pool.query(query, params);

    return sendSuccess(res, 200, 'Tasks retrieved successfully', tasks);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a task within a project
 * @route   POST /api/projects/:projectId/tasks
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;
    const { title, description, priority, status, due_date, assigned_to } = req.body;

    const isOwner = await verifyProjectOwnership(projectId, userId);
    if (!isOwner) {
      return sendError(res, 404, 'Project not found');
    }

    // Required fields validation
    if (!title || !title.trim()) {
      return sendError(res, 400, 'Task title is required');
    }
    if (!priority) {
      return sendError(res, 400, 'Priority is required');
    }
    if (!VALID_PRIORITIES.includes(priority.toUpperCase())) {
      return sendError(res, 400, `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }
    if (!status) {
      return sendError(res, 400, 'Status is required');
    }
    if (!VALID_STATUSES.includes(status.toUpperCase())) {
      return sendError(res, 400, `Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    const trimmedTitle = title.trim();
    const trimmedDesc = description ? description.trim() : null;
    const taskPriority = priority.toUpperCase();
    const taskStatus = status.toUpperCase();
    const dueDateVal = due_date && due_date.trim() ? due_date.trim() : null;
    const assignedToVal = assigned_to && assigned_to.trim() ? assigned_to.trim() : null;

    const [result] = await pool.query(
      `INSERT INTO tasks (project_id, title, description, priority, status, due_date, assigned_to)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [projectId, trimmedTitle, trimmedDesc, taskPriority, taskStatus, dueDateVal, assignedToVal]
    );

    const [createdRows] = await pool.query(
      `SELECT 
        id, 
        project_id, 
        title, 
        description, 
        status, 
        priority, 
        DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date, 
        assigned_to, 
        created_at, 
        updated_at 
       FROM tasks WHERE id = ?`,
      [result.insertId]
    );

    return sendSuccess(res, 201, 'Task created successfully', createdRows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT 
        t.id, 
        t.project_id, 
        t.title, 
        t.description, 
        t.status, 
        t.priority, 
        DATE_FORMAT(t.due_date, '%Y-%m-%d') AS due_date, 
        t.assigned_to, 
        t.created_at, 
        t.updated_at 
       FROM tasks t
       INNER JOIN projects p ON t.project_id = p.id
       WHERE t.id = ? AND p.created_by = ?`,
      [id, userId]
    );

    if (rows.length === 0) {
      return sendError(res, 404, 'Task not found');
    }

    return sendSuccess(res, 200, 'Task retrieved successfully', rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task details or change status/priority
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, description, status, priority, due_date, assigned_to } = req.body;

    // Check task existence and ownership via parent project
    const [existing] = await pool.query(
      `SELECT t.* 
       FROM tasks t
       INNER JOIN projects p ON t.project_id = p.id
       WHERE t.id = ? AND p.created_by = ?`,
      [id, userId]
    );

    if (existing.length === 0) {
      return sendError(res, 404, 'Task not found');
    }

    const currentTask = existing[0];

    // Validate title if provided
    let updatedTitle = currentTask.title;
    if (title !== undefined) {
      if (!title || !title.trim()) {
        return sendError(res, 400, 'Task title is required');
      }
      updatedTitle = title.trim();
    }

    // Validate status if provided
    let updatedStatus = currentTask.status;
    if (status !== undefined) {
      const upperStatus = status.toUpperCase();
      if (!VALID_STATUSES.includes(upperStatus)) {
        return sendError(res, 400, `Status must be one of: ${VALID_STATUSES.join(', ')}`);
      }
      updatedStatus = upperStatus;
    }

    // Validate priority if provided
    let updatedPriority = currentTask.priority;
    if (priority !== undefined) {
      const upperPriority = priority.toUpperCase();
      if (!VALID_PRIORITIES.includes(upperPriority)) {
        return sendError(res, 400, `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
      }
      updatedPriority = upperPriority;
    }

    const updatedDesc = description !== undefined ? (description ? description.trim() : null) : currentTask.description;
    const updatedDueDate = due_date !== undefined ? (due_date && due_date.trim() ? due_date.trim() : null) : currentTask.due_date;
    const updatedAssignedTo = assigned_to !== undefined ? (assigned_to ? assigned_to.trim() : null) : currentTask.assigned_to;

    await pool.query(
      `UPDATE tasks 
       SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, assigned_to = ?
       WHERE id = ?`,
      [updatedTitle, updatedDesc, updatedStatus, updatedPriority, updatedDueDate, updatedAssignedTo, id]
    );

    const [updatedRows] = await pool.query(
      `SELECT 
        id, 
        project_id, 
        title, 
        description, 
        status, 
        priority, 
        DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date, 
        assigned_to, 
        created_at, 
        updated_at 
       FROM tasks WHERE id = ?`,
      [id]
    );

    return sendSuccess(res, 200, 'Task updated successfully', updatedRows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [existing] = await pool.query(
      `SELECT t.id 
       FROM tasks t
       INNER JOIN projects p ON t.project_id = p.id
       WHERE t.id = ? AND p.created_by = ?`,
      [id, userId]
    );

    if (existing.length === 0) {
      return sendError(res, 404, 'Task not found');
    }

    await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

    return sendSuccess(res, 200, 'Task deleted successfully', { id: Number(id) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasksByProject,
  createTask,
  getTaskById,
  updateTask,
  deleteTask
};
