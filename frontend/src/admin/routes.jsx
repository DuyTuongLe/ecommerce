import { Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import MenuManager from "./pages/MenuManager";

function Dashboard() {
  return <h2>Dashboard Page</h2>;
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