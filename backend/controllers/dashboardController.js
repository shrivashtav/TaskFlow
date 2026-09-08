const { pool } = require('../config/db');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @desc    Get dashboard metrics & recent projects from MySQL
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Fetch aggregate statistics
    const [projectCountRow] = await pool.query(
      'SELECT COUNT(*) AS total_projects FROM projects WHERE created_by = ?',
      [userId]
    );

    const [taskStatsRow] = await pool.query(
      `SELECT 
        COUNT(t.id) AS total_tasks,
        SUM(CASE WHEN t.status IN ('TODO', 'IN_PROGRESS') THEN 1 ELSE 0 END) AS pending_tasks,
        SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_tasks
       FROM tasks t
       INNER JOIN projects p ON t.project_id = p.id
       WHERE p.created_by = ?`,
      [userId]
    );

    const stats = {
      total_projects: Number(projectCountRow[0]?.total_projects || 0),
      total_tasks: Number(taskStatsRow[0]?.total_tasks || 0),
      pending_tasks: Number(taskStatsRow[0]?.pending_tasks || 0),
      completed_tasks: Number(taskStatsRow[0]?.completed_tasks || 0)
    };

    // 2. Fetch Recent Projects with Task Completion counts
    const [recentProjects] = await pool.query(
      `SELECT 
        p.id,
        p.name,
        p.description,
        p.created_at,
        p.updated_at,
        COUNT(t.id) AS total_tasks,
        SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_tasks
       FROM projects p
       LEFT JOIN tasks t ON p.id = t.project_id
       WHERE p.created_by = ?
       GROUP BY p.id
       ORDER BY p.updated_at DESC, p.created_at DESC
       LIMIT 5`,
      [userId]
    );

    // Format counts as integers
    const formattedProjects = recentProjects.map(proj => ({
      ...proj,
      total_tasks: Number(proj.total_tasks || 0),
      completed_tasks: Number(proj.completed_tasks || 0)
    }));

    return sendSuccess(res, 200, 'Dashboard stats retrieved successfully', {
      stats,
      recent_projects: formattedProjects
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
