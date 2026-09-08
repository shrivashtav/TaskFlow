const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * @desc    Authenticate user & get JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Field validations
    if (!email || !email.trim()) {
      return sendError(res, 400, 'Email is required');
    }
    if (!password || !password.trim()) {
      return sendError(res, 400, 'Password is required');
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Query user by email
    const [rows] = await pool.query(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [trimmedEmail]
    );

    if (rows.length === 0) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const user = rows[0];

    // Compare bcrypt password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'super_secret_taskflow_jwt_key_987654321';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      secret,
      { expiresIn }
    );

    return sendSuccess(res, 200, 'Login successful', {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently authenticated user details
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  return sendSuccess(res, 200, 'User profile retrieved', {
    user: req.user
  });
};

module.exports = {
  login,
  getMe
};
