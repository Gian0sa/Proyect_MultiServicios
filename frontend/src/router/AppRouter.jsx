import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

import ClientPage from '../pages/Home/ClientPage';

import TransporteAdmin from '../pages/Transporte/TransporteAdmin';
import Dashboard from '../pages/Admin/Dashboard';

import AdminLayout from '../layouts/AdminLayout';
import PrivateRoute from '../auth/PrivateRoute';

import ToursPage from '../pages/Tours/ToursPage';
import TransportePage from '../pages/Transporte/TransportePage';
import HospedajePage from '../pages/Hospedaje/HospedajePage'; 
import PaquetePage from '../pages/Paquetes/PaquetePage';
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
          <Route path="transportes" element={<TransporteAdmin />} />
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
