// src/router.jsx

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import AdminRoutes from "./admin/routes/AdminRoutes";

export default function Router() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/admin/*"
          element={<AdminRoutes />}
        />

      </Routes>

    </BrowserRouter>
  );
}