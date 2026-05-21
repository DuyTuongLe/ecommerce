// src/admin/routes/AdminRoutes.jsx

import {
  Routes,
  Route
} from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/Dashboard";
import MenuManager from "../pages/MenuManager";
import MediaManager from "../pages/MediaManager";
import ProductManager from "../pages/ProductManager";
import BrandManager from "../pages/BrandManager";
import AttributeManager from "../pages/AttributeManager";
import OrderManager from "../pages/OrderManager";
import PromotionManager from "../pages/PromotionManager";

export default function AdminRoutes() {

  return (

    <Routes>

      <Route
        path="/"
        element={<AdminLayout />}
      >

        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        <Route
          path="menus"
          element={<MenuManager />}
        />

        <Route
          path="media"
          element={<MediaManager />}
        />

        <Route
          path="products"
          element={<ProductManager />}
        />

        <Route
          path="brands"
          element={<BrandManager />}
        />

        <Route
          path="attributes"
          element={<AttributeManager />}
        />

        <Route
          path="orders"
          element={<OrderManager />}
        />
        
        <Route
          path="promotions"
          element={<PromotionManager />}
        />
      </Route>

    </Routes>
  );
}