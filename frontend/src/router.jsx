import { lazy, Suspense } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import AdminRoutes from "./admin/routes/AdminRoutes";

const StoreRoutes = lazy(() => import("./store/routes/StoreRoutes"));

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/*" element={
                    <Suspense fallback={<div />}>
                        <StoreRoutes />
                    </Suspense>
                } />
            </Routes>
        </BrowserRouter>
    );
}
