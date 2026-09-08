const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { sendError } = require('../utils/apiResponse');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Unauthorized: Access token is missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendError(res, 401, 'Unauthorized: Access token is missing');
    }

    const secret = process.env.JWT_SECRET || 'super_secret_taskflow_jwt_key_987654321';
    
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return sendError(res, 401, 'Unauthorized: Token has expired or is invalid');
    }

    // Verify user still exists in database
    const [rows] = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return sendError(res, 401, 'Unauthorized: User not found');
    }

    req.user = rows[0];
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error.message);
    return sendError(res, 500, 'Internal authentication error');
  }
};

module.exports = {
  authenticateToken
};
