import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import AdminRoutes from "./admin/routes/AdminRoutes";
import StoreRoutes from "./store/routes/StoreRoutes";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/*" element={<StoreRoutes />} />
            </Routes>
        </BrowserRouter>
    );
}
