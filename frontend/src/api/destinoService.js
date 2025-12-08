import api from './api';

export const destinoService = {
  getAll: () => api.get('/Destino'),
  getById: (id) => api.get(`/Destino/${id}`),
  create: (data) => api.post('/Destino', data),
  update: (id, data) => api.put(`/Destino/${id}`, data),
  delete: (id) => api.delete(`/Destino/${id}`),
};

