import { request } from './api';

export const dashboardService = {
  getStats: async () => {
    return request('/dashboard/stats', {
      method: 'GET'
    });
  }
};

export default dashboardService;
