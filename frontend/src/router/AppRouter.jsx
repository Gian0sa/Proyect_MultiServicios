import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import AdminPage from '../pages/Home/AdminPage';
import ClientPage from '../pages/Home/ClientPage';
import PrivateRoute from '../auth/PrivateRoute';

export default function AppRouter() {
return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
        path="/admin"
        element={
            <PrivateRoute allowedRoles={['ADMIN']}>
            <AdminPage />
            </PrivateRoute>
        }
        />

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
