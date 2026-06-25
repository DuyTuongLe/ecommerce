import { useEffect, useState } from "react";
import { getCustomContent } from "../../shared/services/storeApi";
import { getCached, setCached } from "../utils/cache";
import SectionRenderer from "./SectionRenderer";

export default function StoreFooter({ lang = "vi", siteSettings = {} }) {
    const [sections, setSections] = useState(() => getCached(`footer_${lang}`) || []);
    const settings = siteSettings;

    useEffect(() => {
        setSections(getCached(`footer_${lang}`) || []);
        getCustomContent("footer", lang).then((d) => {
            setSections(d);
            setCached(`footer_${lang}`, d);
        });
    }, [lang]);

    const hasCustomFooter = sections.length > 0;

    return (
        <footer style={{ background: "var(--color-primary-dark)", color: "rgba(255,255,255,0.7)" }}>
            {hasCustomFooter ? (
                sections.map((section) => (
                    <SectionRenderer key={section.id} data={section.noi_dung_json} />
                ))
            ) : (
                <div className="py-10 px-5">
                    <div className="max-w-6xl mx-auto">
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
                            <div>
                                <h4 style={{ color: "#fff", marginBottom: 12, fontWeight: 600 }}>{settings.site_name || "Ecommerce"}</h4>
                                <p style={{ fontSize: 14, lineHeight: 1.7 }}>
                                    {settings.footer_text || "© 2026 Ecommerce. All rights reserved."}
                                </p>
                            </div>
                            <div>
                                <h4 style={{ color: "#fff", marginBottom: 12, fontWeight: 600 }}>Liên hệ</h4>
                                <p style={{ fontSize: 14, lineHeight: 1.7 }}>
                                    {settings.contact_email && <>Email: {settings.contact_email}<br /></>}
                                    {settings.contact_phone && <>Phone: {settings.contact_phone}<br /></>}
                                    {settings.contact_address && <>{settings.contact_address}</>}
                                </p>
                            </div>
                            <div>
                                <h4 style={{ color: "#fff", marginBottom: 12, fontWeight: 600 }}>Theo dõi</h4>
                                <div style={{ display: "flex", gap: 12, fontSize: 14 }}>
                                    {settings.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.7)" }}>Facebook</a>}
                                    {settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.7)" }}>Instagram</a>}
                                    {settings.youtube_url && <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.7)" }}>YouTube</a>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}
