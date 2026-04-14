import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientRoutes from "./client/routes";
import AdminRoutes from "./admin/routes";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<ClientRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}