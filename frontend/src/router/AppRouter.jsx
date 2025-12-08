import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PaquetesPage from "../pages/Paquete/PaquetesPage";
import PaqueteDetallePage from "../pages/Paquete/PaqueteDetallePage";

export default function AppRouter() {
return (
    <Routes>
    <Route path="/" element={<MainLayout><HomePage/></MainLayout>} />
    <Route path="/paquetes" element={<MainLayout><PaquetesPage/></MainLayout>} />
    <Route path="/paquete/:id" element={<MainLayout><PaqueteDetallePage/></MainLayout>} />
    </Routes>
);
}
