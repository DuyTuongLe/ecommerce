import { Routes, Route } from "react-router-dom";
import StoreLayout from "../layouts/StoreLayout";
import HomePage from "../pages/HomePage";
import DynamicPage from "../pages/DynamicPage";

export default function StoreRoutes() {
    return (
        <Routes>
            {/* Vietnamese (default, no prefix) */}
            <Route path="/" element={<StoreLayout lang="vi" />}>
                <Route index element={<HomePage lang="vi" />} />
                <Route path=":slug" element={<DynamicPage lang="vi" />} />
            </Route>

            {/* English */}
            <Route path="/en" element={<StoreLayout lang="en" />}>
                <Route index element={<HomePage lang="en" />} />
                <Route path=":slug" element={<DynamicPage lang="en" />} />
            </Route>
        </Routes>
    );
}
