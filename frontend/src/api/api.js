import axios from 'axios';

export const API_URL = 'http://localhost:5264/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* =========================
   INTERCEPTOR REQUEST
========================= */
api.interceptors.request.use(
  config => {
    const auth = localStorage.getItem('auth');

    if (auth) {
      try {
        const { token } = JSON.parse(auth);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        localStorage.removeItem('auth');
      }
    }

    return config;
  },
  error => Promise.reject(error)
);

/* =========================
   INTERCEPTOR RESPONSE
========================= */
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          localStorage.removeItem('auth');

          // evitar redirección infinita
          if (!window.location.pathname.includes('login')) {
            window.location.href = '/login';
          }
          break;

        case 403:
          console.error('Acceso denegado');
          break;

        case 404:
          console.error('Recurso no encontrado');
          break;

        case 500:
          console.error('Error interno del servidor');
          break;

        default:
          console.error('Error HTTP:', status);
      }
    } else if (error.request) {
      console.error('Servidor no responde');
    } else {
      console.error('Error Axios:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
