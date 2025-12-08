import api from './api';

export const imagenService = {
  getAll: () => api.get('/Imagen'),
  getById: (id) => api.get(`/Imagen/${id}`),
  create: (data) => api.post('/Imagen', data),
  delete: (id) => api.delete(`/Imagen/${id}`),
  getByEntidad: (tipoEntidad, idEntidad) => 
    api.get(`/Imagen/entidad/${tipoEntidad}/${idEntidad}`),
};

