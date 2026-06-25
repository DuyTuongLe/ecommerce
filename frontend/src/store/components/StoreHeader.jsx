import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getHeaderMenu } from "../../shared/services/storeApi";
import { usePageContext } from "../context/PageContext";
import { useCart } from "../context/CartContext";
import { getCached, setCached } from "../utils/cache";

function getTitle(item, lang) {
    const nn = item.ngonngus?.find((n) => n.ngonngu === lang);
    return nn?.danduong_nn_ten || "";
}

function getSlug(item, lang) {
    const url = item.urls?.find((u) => u.ngonngu === lang);
    return url?.slug || item.urls?.[0]?.slug || "";
}

function buildLink(slug, lang) {
    if (!slug) return lang === "en" ? "/en" : "/";
    return lang === "en" ? `/en/${slug}` : `/${slug}`;
}


export default function StoreHeader({ lang = "vi", siteSettings = {} }) {
    const [menu, setMenu] = useState(() => getCached(`header_menu_${lang}`) || []);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const searchRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { alternateSlugs } = usePageContext();
    const { totalItems } = useCart();
    const cartUrl = lang === "vi" ? "/gio-hang" : "/en/cart";
    const productUrl = lang === "vi" ? "/san-pham" : "/en/products";

    function handleSearch(e) {
        e.preventDefault();
        if (!searchText.trim()) return;
        navigate(`${productUrl}?search=${encodeURIComponent(searchText.trim())}`);
        setSearchOpen(false);
        setSearchText("");
    }

    useEffect(() => {
        if (searchOpen && searchRef.current) searchRef.current.focus();
    }, [searchOpen]);

    useEffect(() => {
        setMenu(getCached(`header_menu_${lang}`) || []);
        getHeaderMenu(lang).then((m) => {
            setMenu(m);
            setCached(`header_menu_${lang}`, m);
        });
    }, [lang]);

    const switchLang = lang === "vi" ? "en" : "vi";

    let switchUrl;
    const altSlug = alternateSlugs?.[switchLang];
    if (altSlug) {
        switchUrl = switchLang === "en" ? `/en/${altSlug}` : `/${altSlug}`;
    } else if (location.pathname === "/" || location.pathname === "/en" || location.pathname === "/en/") {
        switchUrl = switchLang === "en" ? "/en" : "/";
    } else {
        switchUrl = switchLang === "en" ? "/en" : "/";
    }

    function renderItems(items) {
        return items
            .filter((item) => item.trangthai)
            .map((item) => {
                const title = getTitle(item, lang);
                const slug = getSlug(item, lang);
                const hasChildren = item.children?.length > 0;

                if (!title) return null;

                const href = slug ? buildLink(slug, lang) : null;

                return (
                    <li key={item.id}>
                        {href ? (
                            <Link to={href}>{title}</Link>
                        ) : (
                            <span className="cursor-default">{title}</span>
                        )}
                        {hasChildren && (
                            <ul className="store-nav-dropdown">
                                {renderItems(item.children)}
                            </ul>
                        )}
                    </li>
                );
            })
            .filter(Boolean);
    }

    return (
        <header className="sticky top-0 z-50" style={{ background: "var(--color-bg-sidebar)" }}>
            <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16">
                <Link
                    to={lang === "en" ? "/en" : "/"}
                    className="text-xl font-bold text-white no-underline hover:text-white"
                >
                    {siteSettings.logo_id_url ? (
                        <img src={siteSettings.logo_id_url} alt={siteSettings.site_name || ""} style={{ height: 40, objectFit: "contain" }} />
                    ) : (
                        siteSettings.site_name || ""
                    )}
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <ul className="store-nav flex gap-6 list-none m-0 p-0">
                        {renderItems(menu)}
                    </ul>

                    {/* Search */}
                    {searchOpen ? (
                        <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <input
                                ref={searchRef}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder={lang === "vi" ? "Tìm sản phẩm..." : "Search..."}
                                style={{
                                    padding: "4px 10px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.3)",
                                    background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 13, width: 180, outline: "none",
                                }}
                                onBlur={() => { if (!searchText) setSearchOpen(false); }}
                            />
                            <button type="submit" style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 14 }}>→</button>
                        </form>
                    ) : (
                        <button onClick={() => setSearchOpen(true)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 18, padding: 0 }}>🔍</button>
                    )}

                    <Link to={cartUrl} style={{ position: "relative", color: "#fff", textDecoration: "none", fontSize: 20 }}>
                        🛒
                        {totalItems > 0 && (
                            <span style={{ position: "absolute", top: -8, right: -10, background: "#ff4d4f", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    <Link
                        to={switchUrl}
                        className="text-xs px-2 py-1 rounded border border-white/30 text-white/80 no-underline hover:text-white hover:border-white"
                    >
                        {switchLang.toUpperCase()}
                    </Link>
                </div>
            </div>
        </header>
    );
}
