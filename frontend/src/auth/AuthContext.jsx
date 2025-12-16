import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (data) => {
    const authData = {
      token: data.token,
      role: data.role,
      usuarioId: data.usuarioId,
      nombre: data.nombre,
      email: data.email,
    };

    setUser(authData);
    localStorage.setItem('auth', JSON.stringify(authData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
