import api from './api';

export const servicioService = {
  getAll: () => api.get('/Servicio'),
  getById: (id) => api.get(`/Servicio/${id}`),
  create: (data) => api.post('/Servicio', data),
  update: (id, data) => api.put(`/Servicio/${id}`, data),
  delete: (id) => api.delete(`/Servicio/${id}`),
};

