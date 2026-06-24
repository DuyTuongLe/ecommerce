import { Routes, Route, Navigate } from "react-router-dom";
import { Spin } from "antd";
import { AuthProvider, useAuth } from "../../shared/context/AuthContext";

import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import MenuManager from "../pages/MenuManager";
import MediaManager from "../pages/MediaManager";
import ProductManager from "../pages/ProductManager";
import BrandManager from "../pages/BrandManager";
import AttributeManager from "../pages/AttributeManager";
import OrderManager from "../pages/OrderManager";
import PromotionManager from "../pages/PromotionManager";
import AttributeValueManager from "../pages/AttributeValueManager";
import ProductCreatePage from "../pages/ProductCreatePage";
import ProductEditPage from "../pages/ProductEditPage";
import NoiDungManager from "../pages/NoiDungManager";
import NoiDungEditor from "../pages/NoiDungEditor";
import LanguageManager from "../pages/LanguageManager";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}

function GuestRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (user) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
}

export default function AdminRoutes() {
    return (
        <AuthProvider>
            <Routes>
                <Route
                    path="login"
                    element={
                        <GuestRoute>
                            <LoginPage />
                        </GuestRoute>
                    }
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="menus" element={<MenuManager />} />
                    <Route path="media" element={<MediaManager />} />
                    <Route path="products" element={<ProductManager />} />
                    <Route path="brands" element={<BrandManager />} />
                    <Route path="attributes" element={<AttributeManager />} />
                    <Route path="attributevalues" element={<AttributeValueManager />} />
                    <Route path="orders" element={<OrderManager />} />
                    <Route path="promotions" element={<PromotionManager />} />
                    <Route path="products/create" element={<ProductCreatePage />} />
                    <Route path="products/:id/edit" element={<ProductEditPage />} />
                    <Route path="languages" element={<LanguageManager />} />
                    <Route path="noi-dung" element={<NoiDungManager />} />
                    <Route path="noi-dung/create" element={<NoiDungEditor />} />
                    <Route path="noi-dung/:id/edit" element={<NoiDungEditor />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
}
