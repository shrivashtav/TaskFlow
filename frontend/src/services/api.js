/**
 * Centralized API Client
 * Automatically attaches JWT Bearer token and handles error formatting
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('taskflow_token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      // If unauthorized, clear token and trigger redirect
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
        window.location.href = '/login';
      }

      const error = new Error(result.message || 'An error occurred during API request');
      error.status = response.status;
      error.data = result;
      throw error;
    }

    return result;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to reach server. Please ensure the backend is running.');
    }
    throw error;
  }
}

export default request;
