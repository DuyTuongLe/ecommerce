import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getHeaderMenu } from "../../shared/services/storeApi";
import { usePageContext } from "../context/PageContext";

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
    const [menu, setMenu] = useState([]);
    const location = useLocation();
    const { alternateSlugs } = usePageContext();

    useEffect(() => {
        getHeaderMenu(lang).then(setMenu);
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
                        <img src={siteSettings.logo_id_url} alt={siteSettings.site_name || "Logo"} style={{ height: 40, objectFit: "contain" }} />
                    ) : (
                        siteSettings.site_name || "Ecommerce"
                    )}
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <ul className="store-nav flex gap-6 list-none m-0 p-0">
                        {renderItems(menu)}
                    </ul>

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
