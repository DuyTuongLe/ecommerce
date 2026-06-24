import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductDetail } from "../../shared/services/storeApi";
import { usePageContext } from "../context/PageContext";

export default function ProductDetail({ productId, lang = "vi" }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(null);
    const { setAlternateSlugs, setBreadcrumbs } = usePageContext();

    useEffect(() => {
        setLoading(true);
        getProductDetail(productId, lang)
            .then((res) => {
                setProduct(res);
                setAlternateSlugs(res.alternate_slugs || {});
                setBreadcrumbs(res.breadcrumbs || null);
                setActiveImg(res.thumbnail);
                if (res.seo_title) document.title = res.seo_title;
                else if (res.name) document.title = res.name;
            })
            .catch(() => setProduct(null))
            .finally(() => setLoading(false));
    }, [productId, lang]);

    if (loading) return <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>Loading...</div>;
    if (!product) return <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px" }}>Không tìm thấy sản phẩm</div>;

    const allImages = [product.thumbnail, ...product.gallery].filter(Boolean);
    const prefix = lang === "vi" ? "" : `/${lang}`;

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
            {/* Main: 2 columns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 40 }}>
                {/* Left — Images */}
                <div>
                    <div style={{ aspectRatio: "1", background: "#f5f5f5", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
                        {activeImg && <img src={activeImg} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />}
                    </div>
                    {allImages.length > 1 && (
                        <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                            {allImages.map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => setActiveImg(img)}
                                    style={{
                                        width: 64, height: 64, flexShrink: 0, borderRadius: 4, overflow: "hidden", cursor: "pointer",
                                        border: activeImg === img ? "2px solid #2f456f" : "1px solid #ddd",
                                    }}
                                >
                                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right — Info */}
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>{product.name}</h1>

                    {product.brand && <div style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>{lang === "vi" ? "Thương hiệu" : "Brand"}: <strong>{product.brand}</strong></div>}

                    {product.sku && <div style={{ fontSize: 13, color: "#999", marginBottom: 12 }}>SKU: {product.sku}</div>}

                    {/* Price */}
                    <div style={{ marginBottom: 16 }}>
                        {product.sale_price ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ fontSize: 24, fontWeight: 700, color: "red" }}>{Number(product.sale_price).toLocaleString("vi-VN")}₫</span>
                                <span style={{ fontSize: 16, textDecoration: "line-through", color: "#999" }}>{Number(product.price).toLocaleString("vi-VN")}₫</span>
                                {product.discount_type === "percent" && product.discount_percent > 0 && (
                                    <span style={{ fontSize: 13, background: "red", color: "#fff", padding: "2px 6px", borderRadius: 4 }}>
                                        -{Number(product.discount_percent)}%
                                    </span>
                                )}
                                {product.discount_type === "fixed" && product.discount_amount > 0 && (
                                    <span style={{ fontSize: 13, background: "red", color: "#fff", padding: "2px 6px", borderRadius: 4 }}>
                                        -{Number(product.discount_amount).toLocaleString("vi-VN")}₫
                                    </span>
                                )}
                            </div>
                        ) : product.price ? (
                            <span style={{ fontSize: 24, fontWeight: 700, color: "#2f456f" }}>{Number(product.price).toLocaleString("vi-VN")}₫</span>
                        ) : null}
                    </div>

                    {/* Short description */}
                    {product.short_description && (
                        <div style={{ fontSize: 14, color: "#555", lineHeight: 1.6, marginBottom: 16 }}>{product.short_description}</div>
                    )}

                    {/* Attributes */}
                    {product.attributes.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            {product.attributes.map((attr, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 14 }}>
                                    <span style={{ color: "#666", minWidth: 100 }}>{attr.attribute_name}:</span>
                                    {attr.color_code && (
                                        <span style={{ width: 18, height: 18, borderRadius: "50%", background: attr.color_code, border: "1px solid #ccc", flexShrink: 0 }} />
                                    )}
                                    <strong>{attr.value_name}</strong>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Stock */}
                    <div style={{ fontSize: 14, color: product.stock_status === "in_stock" || product.stock > 0 ? "green" : "#999", marginBottom: 16 }}>
                        {product.stock_status === "in_stock" || product.stock > 0
                            ? (lang === "vi" ? "Còn hàng" : "In stock")
                            : (lang === "vi" ? "Hết hàng" : "Out of stock")}
                    </div>
                </div>
            </div>

            {/* Content / Description */}
            {product.content && (
                <div style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #2f456f" }}>
                        {lang === "vi" ? "Mô tả sản phẩm" : "Product Description"}
                    </h2>
                    <div dangerouslySetInnerHTML={{ __html: product.content }} />
                </div>
            )}

            {/* Related Products */}
            {product.related?.length > 0 && (
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #2f456f" }}>
                        {lang === "vi" ? "Sản phẩm liên quan" : "Related Products"}
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                        {product.related.map((p) => (
                            <div key={p.id} style={{ border: "1px solid #eee", borderRadius: 4, overflow: "hidden" }}>
                                <div style={{ aspectRatio: "1", background: "#f5f5f5", overflow: "hidden" }}>
                                    {p.thumbnail ? (
                                        <img src={p.thumbnail} alt={p.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc" }}>No img</div>
                                    )}
                                </div>
                                <div style={{ padding: 8 }}>
                                    <div style={{ fontWeight: 500, marginBottom: 4 }}>
                                        {p.slug ? <Link to={`${prefix}/${p.slug}`} style={{ color: "#333", textDecoration: "none" }}>{p.name}</Link> : p.name}
                                    </div>
                                    <div>
                                        {p.sale_price ? (
                                            <>
                                                <span style={{ color: "red", fontWeight: 700 }}>{Number(p.sale_price).toLocaleString("vi-VN")}₫</span>{" "}
                                                <span style={{ textDecoration: "line-through", color: "#999", fontSize: 13 }}>{Number(p.price).toLocaleString("vi-VN")}₫</span>
                                            </>
                                        ) : p.price ? (
                                            <span style={{ fontWeight: 700 }}>{Number(p.price).toLocaleString("vi-VN")}₫</span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
