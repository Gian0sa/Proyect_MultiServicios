import api from './api';

export const ventaService = {
  getAll: () => api.get('/Venta'),
  getById: (id) => api.get(`/Venta/${id}`),
  create: (data) => api.post('/Venta', data),
  getByUsuario: (usuarioId) => api.get(`/Venta/usuario/${usuarioId}`),
};

