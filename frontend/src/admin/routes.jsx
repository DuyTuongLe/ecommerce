//src/admin/router.jsx
import { Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import MenuManager from "./pages/MenuManager";

function Dashboard() {
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="menu" element={<MenuManager />} />
      </Route>
    </Routes>
  );
}