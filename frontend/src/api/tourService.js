import api from './api';

export const tourService = {
  getAll: () => api.get('/Tour'),
  getById: (id) => api.get(`/Tour/${id}`),
  create: (data) => api.post('/Tour', data),
  update: (id, data) => api.put(`/Tour/${id}`, data),
  delete: (id) => api.delete(`/Tour/${id}`),
};

