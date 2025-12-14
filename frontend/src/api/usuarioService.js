import api from './api';

export const usuarioService = {
  login: (email, password) => api.post('/Usuario/login', { email, password }),
  register: (userData) =>
    api.post('/Usuario/registrar', {
      dni: userData.dni,
      nombre: userData.nombre,
      apellido: userData.apellido,
      email: userData.email,
      password: userData.password
    }),
  getProfile: () => api.get('/Usuario/profile'),
  updateProfile: (data) => api.put('/Usuario/profile', data),
};

