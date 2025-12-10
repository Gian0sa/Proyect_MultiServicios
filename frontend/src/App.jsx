import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter'; // Importamos el router
import { BrowserRouter } from 'react-router-dom'; // Necesario para el Router

export default function App() {
  return (
    // <BrowserRouter> va fuera de App.jsx en index.jsx, pero lo pondremos aquí por ahora
    <BrowserRouter> 
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}