import { useEffect, useState } from "react";
import { getHomePage } from "../../shared/services/storeApi";
import ContentBlock from "../components/ContentBlock";
import { usePageContext } from "../context/PageContext";

export default function HomePage({ lang = "vi" }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { setAlternateSlugs, setBreadcrumbs } = usePageContext();

    useEffect(() => {
        setLoading(true);
        setAlternateSlugs({});
        setBreadcrumbs(null);
        getHomePage(lang).then((res) => {
            setData(res);
            setAlternateSlugs(res?.alternate_slugs || {});
            if (res?.page?.seo_title) document.title = res.page.seo_title;
        }).finally(() => setLoading(false));
    }, [lang]);

    if (loading) return <div className="max-w-6xl mx-auto px-5 py-16 text-center">Loading...</div>;
    if (!data) return <div className="max-w-6xl mx-auto px-5 py-16">Page not found</div>;

    return (
        <>
            {data.sections?.map((section) => (
                <ContentBlock key={section.id} section={section} />
            ))}
        </>
    );
}
