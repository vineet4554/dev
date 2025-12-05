import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('powerRangerUser');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  getMe: () => api.get('/auth/me'),
};

// Issues API
export const issuesAPI = {
  getAll: (params) => api.get('/issues', { params }),
  getById: (id) => api.get(`/issues/${id}`),
  create: (data) => api.post('/issues', data),
  update: (id, data) => api.patch(`/issues/${id}`, data),
  delete: (id) => api.delete(`/issues/${id}`),
  updateStatus: (id, status) => api.post(`/issues/${id}/status`, { status }),
  assign: (id, assignedTo) => api.post(`/issues/${id}/assign`, { assignedTo }),
  unassign: (id) => api.post(`/issues/${id}/unassign`),
  getStatusHistory: (id) => api.get(`/issues/${id}/status-history`),
  bulkUpdate: (issueIds, updates) => api.post('/issues/bulk', { issueIds, updates }),
};

// Comments API
export const commentsAPI = {
  getByIssue: (issueId) => api.get(`/comments/issue/${issueId}`),
  create: (issueId, body) => api.post(`/comments/issue/${issueId}`, { body }),
  update: (id, body) => api.patch(`/comments/${id}`, { body }),
  delete: (id) => api.delete(`/comments/${id}`),
};

// Attachments API
export const attachmentsAPI = {
  getByIssue: (issueId) => api.get(`/attachments/issue/${issueId}`),
  upload: (issueId, formData) => api.post(`/attachments/issue/${issueId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/attachments/${id}`),
};

// Engineers API (users with engineer role)
export const engineersAPI = {
  getAll: () => api.get('/users/engineers'),
};

export default api;

