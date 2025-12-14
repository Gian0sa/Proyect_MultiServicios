import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
const [user, setUser] = useState(null); 
  // user = { token, role }

const login = (data) => {
  setUser({
    token: data.token,
    role: data.role,
    usuarioId: data.usuarioId,
    nombre: data.nombre,
    email: data.email,
  });
};


const logout = () => {
    setUser(null);
};

return (
    <AuthContext.Provider value={{ user, login, logout }}>
    {children}
    </AuthContext.Provider>
);
}

export const useAuth = () => useContext(AuthContext);
