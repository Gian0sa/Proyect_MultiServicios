import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    
    // Opcional: Puedes decidir ocultar el footer en ciertas rutas si es necesario
    if (location.pathname.startsWith('/admin')) {
        // return null; 
    }

    return (
        <footer className="bg-gray-800 text-white p-6 mt-auto">
            <div className="container mx-auto text-center">
                <p>&copy; 2024 Tour Viajes. Todos los derechos reservados. Backend en Puerto 5264</p>
            </div>
        </footer>
    );
};

export default Footer;