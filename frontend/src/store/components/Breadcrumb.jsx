import { Link } from "react-router-dom";
import { usePageContext } from "../context/PageContext";

export default function Breadcrumb({ lang = "vi" }) {
    const { breadcrumbs } = usePageContext();

    if (!breadcrumbs || breadcrumbs.length === 0) return null;

    const prefix = lang === "vi" ? "" : `/${lang}`;
    const homeLabel = lang === "vi" ? "Trang chủ" : "Home";

    return (
        <nav className="store-breadcrumb">
            <div className="max-w-6xl mx-auto px-5">
                <ol>
                    <li>
                        <Link to={prefix || "/"}>{homeLabel}</Link>
                    </li>
                    {breadcrumbs.map((crumb, i) => (
                        <li key={i}>
                            <span className="store-breadcrumb-sep">/</span>
                            {crumb.slug && i < breadcrumbs.length - 1 ? (
                                <Link to={`${prefix}/${crumb.slug}`}>{crumb.title}</Link>
                            ) : (
                                <span className="store-breadcrumb-current">{crumb.title}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </nav>
    );
}
