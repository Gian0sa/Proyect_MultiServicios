import React, { useState, useEffect, createContext, useContext } from 'react';
import api from '../api/api'; // Ruta ajustada a tu carpeta src/api/

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [token, setToken] = useState(localStorage.getItem('jwtToken') || null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

  // 1. Inicialización: Configura Axios y lee el token
useEffect(() => {
    if (token) {
        localStorage.setItem('jwtToken', token);
        // Si tienes token pero no hay usuario cargado (ej. al refrescar)
        if (!user) {
             // Esto se actualiza completamente al hacer Login, por ahora solo es un marcador.
            setUser({ name: 'Usuario Cargado', role: 'CLIENTE' }); 
        }
    } else {
        localStorage.removeItem('jwtToken');
        setUser(null);
    }
}, [token]);


  // 2. Función de Login
const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/usuarioService/login`, { email, password }); // Asumiendo que el servicio está disponible
    
      // OBTENEMOS EL ROL DEL BACKEND
    const { token: jwtToken, usuarioId, nombre, role } = response.data; 
    
    setToken(jwtToken);
    setUser({ id: usuarioId, name: nombre, role: role || 'CLIENTE' }); 
    return true;
    } catch (err) {
    console.error("Login falló:", err.response?.data || err.message);
    setError("Credenciales inválidas o error de conexión.");
    return false;
    } finally {
    setLoading(false);
    }
};

  // 3. Función de Registro (Placeholder)
const register = async (userData) => {
    // Implementación similar a login, llama a /usuarioService/register
    return { success: true };
};


const logout = () => {
    setToken(null);
    setUser(null);
};

return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout, register, isAuthenticated: !!token }}>
    {children}
    </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);