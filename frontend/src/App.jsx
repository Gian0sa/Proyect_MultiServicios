import React from 'react';
import { AuthProvider } from './auth/AuthContext';
import AppRouter from './router/AppRouter';
import { CartProvider } from '../src/pages/Carrito/CartContext';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </AuthProvider>
  );
}
