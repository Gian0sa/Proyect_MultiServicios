import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

import ClientPage from '../pages/Home/ClientPage';

import TransporteAdmin from '../pages/Transporte/TransporteAdmin';
import Dashboard from '../pages/Admin/Dashboard';

import AdminLayout from '../layouts/AdminLayout';
import PrivateRoute from '../auth/PrivateRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
