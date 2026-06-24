import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPageBySlug } from "../../shared/services/storeApi";
import ContentBlock from "../components/ContentBlock";
import { usePageContext } from "../context/PageContext";

export default function DynamicPage({ lang = "vi" }) {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { setAlternateSlugs } = usePageContext();

    useEffect(() => {
        setLoading(true);
        getPageBySlug(slug, lang)
            .then((res) => {
                setData(res);
                setAlternateSlugs(res?.alternate_slugs || {});
                const title = res?.page?.seo_title || res?.content?.seo_title || res?.page?.title || "";
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

    if (data.type === "content") {
        const c = data.content;
        return (
            <div className="max-w-6xl mx-auto px-5 py-8">
                {c.title && <h1 className="text-3xl font-bold mb-8">{c.title}</h1>}
                {c.thumbnail && (
                    <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-full max-h-96 object-cover rounded-lg mb-6"
                    />
                )}
                <ContentBlock section={c} />
            </div>
        );
    }

    return <div className="max-w-6xl mx-auto px-5 py-16"><h1 className="text-2xl font-bold">404</h1></div>;
}
