import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPageBySlug } from "../../shared/services/storeApi";
import ContentBlock from "../components/ContentBlock";
import ProductDetail from "./ProductDetail";
import ProductPage from "./ProductPage";
import BlogPage from "./BlogPage";
import { usePageContext } from "../context/PageContext";

export default function DynamicPage({ lang = "vi" }) {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { setAlternateSlugs, setBreadcrumbs } = usePageContext();

    useEffect(() => {
        setLoading(true);
        getPageBySlug(slug, lang)
            .then((res) => {
                setData(res);
                setAlternateSlugs(res?.alternate_slugs || {});
                setBreadcrumbs(res?.breadcrumbs || null);
                const title = res?.seo_title || res?.page?.seo_title || res?.content?.seo_title || res?.page?.title || res?.title || "";
                if (title) document.title = title;
            })
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [slug, lang]);

    if (loading) return <div className="max-w-6xl mx-auto px-5 py-16 text-center">Loading...</div>;
    if (!data) return <div className="max-w-6xl mx-auto px-5 py-16"><h1 className="text-2xl font-bold">404 - Page not found</h1></div>;

    if (data.type === "page") {
        return (
            <>
                {data.sections?.map((section) => (
                    <ContentBlock key={section.id} section={section} />
                ))}
            </>
        );
    }

    if (data.type === "product") {
        return <ProductDetail productId={data.entity_id} lang={lang} />;
    }

    if (data.type === "product_category") {
        return <ProductPage lang={lang} categoryIdOverride={data.category_id} />;
    }

    if (data.type === "blog") {
        return <BlogPage data={data} lang={lang} />;
    }

    if (data.type === "content") {
        const c = data.content;
        const imgS = c.image_settings || {};
        const showImg = c.thumbnail && !imgS.hide_in_detail;
        const imgStyle = {};
        if (imgS.width && imgS.width !== "auto") imgStyle.width = imgS.width + "%";
        if (imgS.height && imgS.height !== "auto") imgStyle.maxHeight = imgS.height + "vh";
        if (imgS.fit) imgStyle.objectFit = imgS.fit;
        const imgWrapStyle = {};
        if (imgS.align === "center") imgWrapStyle.textAlign = "center";
        else if (imgS.align === "right") imgWrapStyle.textAlign = "right";
        const shareUrl = encodeURIComponent(window.location.href);
        const shareTitle = encodeURIComponent(c.title || "");
        return (
            <div className="max-w-6xl mx-auto px-5 py-8">
                {c.title && <h1 className="text-3xl font-bold mb-4">{c.title}</h1>}

                {showImg && (
                    <div style={{ marginBottom: 24, ...imgWrapStyle }}>
                        <img
                            src={c.thumbnail}
                            alt={c.title}
                            style={{ borderRadius: 8, maxWidth: "100%", ...imgStyle }}
                        />
                    </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                    {c.created_at && (
                        <span style={{ fontSize: 14, color: "#999" }}>
                            {new Date(c.created_at).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: "#1877F2", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700 }}
                        >f</a>
                        <a
                            href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: "#000", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700 }}
                        >𝕏</a>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: "#0A66C2", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700 }}
                        >in</a>
                    </div>
                </div>
                <ContentBlock section={c} />
            </div>
        );
    }

    return <div className="max-w-6xl mx-auto px-5 py-16"><h1 className="text-2xl font-bold">404</h1></div>;
}
