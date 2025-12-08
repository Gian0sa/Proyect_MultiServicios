import api from './api';

export const departamentoService = {
  getAll: () => api.get('/Departamento'),
  getById: (id) => api.get(`/Departamento/${id}`),
};

