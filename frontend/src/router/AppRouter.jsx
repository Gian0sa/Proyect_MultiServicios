import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

import ClientPage from '../pages/Home/ClientPage';

import TransporteAdmin from '../pages/Transporte/TransporteAdmin';
import Dashboard from '../pages/Admin/Dashboard';
import ServicioAdmin from '../pages/Admin/ServicioAdmin';
import TourAdmin from '../pages/Admin/TourAdmin';
import VentaAdmin from '../pages/Admin/VentaAdmin';
import UsuarioAdmin from '../pages/Admin/UsuarioAdmin';
import HospedajeAdmin from '../pages/Admin/HospedajeAdmin';
import ImagenAdmin from '../pages/Admin/ImagenAdmin';
import PaqueteAdmin from "../pages/Paquetes/PaqueteAdmin";

import AdminLayout from '../layouts/AdminLayout';
import PrivateRoute from '../auth/PrivateRoute';

import ToursPage from '../pages/Tours/ToursPage';
import TransportePage from '../pages/Transporte/TransportePage';
import HospedajePage from '../pages/Hospedaje/HospedajePage'; 
import PaquetePage from '../pages/Paquetes/PaquetePage';
import PaqueteDetailPage from '../pages/Paquetes/PaqueteDetailPage';

import CartPage from '../pages/Carrito/CartPage';
import CheckoutPage from '../pages/Carrito/CheckoutPage';
import HistorialCompras from '../pages/Cliente/HistorialCompras';
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<ClientPage  />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/paquetes" element={<PaquetePage />} />
        <Route path="/tours" element={<ToursPage />} />
        <Route path="/transportes" element={<TransportePage />} />
        <Route path="/hospedajes" element={<HospedajePage />} />
        <Route path="/paquetes/:id" element={<PaqueteDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/mis-compras" element={<HistorialCompras />} />
        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="servicios" element={<ServicioAdmin />} />
          <Route path="hospedajes" element={<HospedajeAdmin />} />
          <Route path="tours" element={<TourAdmin />} />
          <Route path="transportes" element={<TransporteAdmin />} />
          <Route path="paquetes" element={<PaqueteAdmin />} />
          <Route path="ventas" element={<VentaAdmin />} />
          <Route path="usuarios" element={<UsuarioAdmin />} />
          <Route path="imagenes" element={<ImagenAdmin />} />
        </Route>

        {/* ================= CLIENTE ================= */}
        <Route
          path="/cliente"
          element={
            <PrivateRoute allowedRoles={['CLIENTE']}>
              <ClientPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
