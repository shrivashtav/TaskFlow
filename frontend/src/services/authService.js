import { request } from './api';

export const authService = {
  login: async (email, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  getMe: async () => {
    return request('/auth/me', {
      method: 'GET'
    });
  }
};

export default authService;
