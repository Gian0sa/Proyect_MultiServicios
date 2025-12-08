import api from './api';

export const transporteService = {
  getAll: () => api.get('/Transporte'),
  getById: (id) => api.get(`/Transporte/${id}`),
  create: (data) => api.post('/Transporte', data),
  update: (id, data) => api.put(`/Transporte/${id}`, data),
  delete: (id) => api.delete(`/Transporte/${id}`),
};

