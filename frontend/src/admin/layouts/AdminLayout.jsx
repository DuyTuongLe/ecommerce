// admin/layouts/AdminLayout.jsx
import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* Sidebar */}
      <div style={{
        width: "220px",
        background: "#111",
        color: "#fff",
        padding: "20px"
      }}>
        <h2>Admin</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link to="/admin" style={{ color: "#fff" }}>Dashboard</Link>
          <Link to="/admin/menu" style={{ color: "#fff" }}>Menu</Link>
        </nav>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>

    </div>
  );
}