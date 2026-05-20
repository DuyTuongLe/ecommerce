// src/admin/routes/AdminRoutes.jsx

import {
  Routes,
  Route
} from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/Dashboard";
import MenuManager from "../pages/MenuManager";
import MediaManager from "../pages/MediaManager";

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

      </Route>

    </Routes>
  );
}