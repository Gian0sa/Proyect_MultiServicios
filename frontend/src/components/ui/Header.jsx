import React from 'react';
import { Link } from 'react-router-dom';
// RUTA CORREGIDA: Asumiendo que el Contexto está en src/context/AuthContext
import { useAuth } from '../../context/AuthContext'; 
import { Globe, LogOut } from 'lucide-react';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    
    return (
        <header className="bg-indigo-600 text-white p-4 shadow-lg fixed w-full z-10 top-0">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold flex items-center gap-2">
                    <Globe className="w-6 h-6"/> Tour Viajes
                </Link>
                <nav className="flex gap-4 items-center">
                    <Link to="/" className="hover:underline">Inicio</Link>
                    <Link to="/paquetes" className="hover:underline">Paquetes</Link>
                    <Link to="/servicios" className="hover:underline">Servicios</Link>
                    
                    {isAuthenticated ? (
                        <>
                            {/* Mostrar Panel Admin si el rol es ADMIN */}
                            {user?.role === "ADMIN" && <Link to="/admin/paquetes" className="hover:underline bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">Panel Admin</Link>}

                            <span className="text-sm font-semibold">{user?.name || 'Usuario'}</span>
                            <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm transition flex items-center gap-1">
                                <LogOut className="w-4 h-4"/> Salir
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:underline">Iniciar Sesión</Link>
                            <Link to="/register" className="hover:underline">Registrarse</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;  