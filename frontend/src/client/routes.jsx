// client/routes.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/MainLayout";
import Page from "./pages/Page";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path=":slug" element={<Page />} />
      </Route>
    </Routes>
  );
}