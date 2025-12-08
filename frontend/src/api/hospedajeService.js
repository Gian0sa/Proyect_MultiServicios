import api from './api';

export const hospedajeService = {
  getAll: () => api.get('/Hospedaje'),
  getById: (id) => api.get(`/Hospedaje/${id}`),
  create: (data) => api.post('/Hospedaje', data),
  update: (id, data) => api.put(`/Hospedaje/${id}`, data),
  delete: (id) => api.delete(`/Hospedaje/${id}`),
};

