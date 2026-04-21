// admin/layouts/AdminLayout.jsx
import { Outlet, Link } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="container-admin">
      
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin</h2>

        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/menu">Menu</Link>
        </nav>
      </div>

      {/* Content */}
      <div className="main">
        <Outlet />
      </div>

    </div>
  );
}