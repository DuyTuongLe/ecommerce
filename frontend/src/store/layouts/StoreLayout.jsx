import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import StoreHeader from "../components/StoreHeader";
import StoreFooter from "../components/StoreFooter";
import Breadcrumb from "../components/Breadcrumb";
import ColorEditor from "../components/ColorEditor";
import { PageProvider } from "../context/PageContext";
import { getSettings } from "../../shared/services/storeApi";
import { getMe } from "../../shared/services/authApi";
import "../styles/store.css";
import "../styles/main.css";

export default function StoreLayout({ lang = "vi" }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [editorOpen, setEditorOpen] = useState(false);
    const [savedVars, setSavedVars] = useState(null);
    const [siteSettings, setSiteSettings] = useState({});

    useEffect(() => {
        getMe()
            .then((res) => setIsAdmin(res?.user?.role === "admin"))
            .catch(() => setIsAdmin(false));

        getSettings().then((settings) => {
            setSiteSettings(settings);
            if (settings?.css_variables && typeof settings.css_variables === "object") {
                setSavedVars(settings.css_variables);
                for (const [name, value] of Object.entries(settings.css_variables)) {
                    if (value) document.documentElement.style.setProperty(name, value);
                }
                try { localStorage.setItem("css_variables", JSON.stringify(settings.css_variables)); } catch {}
            }
        });
    }, []);

    return (
        <PageProvider>
            <div className="store-page">
            <StoreHeader lang={lang} siteSettings={siteSettings} />
            <Breadcrumb lang={lang} />
            <main className="main">
                <Outlet />
            </main>
            <StoreFooter />

            {isAdmin && (
                <button
                    onClick={() => setEditorOpen(true)}
                    title="Color Editor"
                    style={{
                        position: "fixed",
                        top: "50%",
                        right: 0,
                        transform: "translateY(-50%)",
                        width: 48,
                        height: 48,
                        borderRadius: "24px 0 0 24px",
                        border: "none",
                        background: "var(--color-primary, #2f456f)",
                        color: "#fff",
                        fontSize: 20,
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        zIndex: 9000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    ⚙
                </button>
            )}

            {editorOpen && (
                <ColorEditor
                    onClose={() => setEditorOpen(false)}
                    savedVars={savedVars}
                    onSaved={(newVars) => setSavedVars(newVars)}
                />
            )}
            </div>
        </PageProvider>
    );
}
