import { Outlet } from "react-router-dom";
import StoreHeader from "../components/StoreHeader";
import StoreFooter from "../components/StoreFooter";
import { PageProvider } from "../context/PageContext";
import "../styles/store.css";

export default function StoreLayout({ lang = "vi" }) {
    return (
        <PageProvider>
            <StoreHeader lang={lang} />
            <main className="min-h-[60vh]">
                <Outlet />
            </main>
            <StoreFooter />
        </PageProvider>
    );
}
