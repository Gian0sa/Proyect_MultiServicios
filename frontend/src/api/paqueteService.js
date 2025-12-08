import api from './api';

export const paqueteService = {
  getAll: () => api.get('/Paquete'),
  getById: (id) => api.get(`/Paquete/${id}`),
  create: (data) => api.post('/Paquete', data),
  update: (id, data) => api.put(`/Paquete/${id}`, data),
  delete: (id) => api.delete(`/Paquete/${id}`),
};

