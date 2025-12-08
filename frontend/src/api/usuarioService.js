import api from './api';

export const usuarioService = {
  login: (email, password) => api.post('/Usuario/login', { email, password }),
  register: (userData) => api.post('/Usuario/register', userData),
  getProfile: () => api.get('/Usuario/profile'),
  updateProfile: (data) => api.put('/Usuario/profile', data),
};

