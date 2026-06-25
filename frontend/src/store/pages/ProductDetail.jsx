import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductDetail } from "../../shared/services/storeApi";
import api from "../../shared/services/api";
import { usePageContext } from "../context/PageContext";
import { useCart } from "../context/CartContext";

export default function ProductDetail({ productId, lang = "vi" }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(null);
    const [qty, setQty] = useState(1);
    const { setAlternateSlugs, setBreadcrumbs } = usePageContext();
    const { addToCart } = useCart();

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

                    {/* Add to cart */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 6 }}>
                            <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 36, height: 36, border: "none", background: "none", fontSize: 18, cursor: "pointer" }}>−</button>
                            <span style={{ width: 40, textAlign: "center", fontWeight: 600 }}>{qty}</span>
                            <button onClick={() => setQty((q) => q + 1)} style={{ width: 36, height: 36, border: "none", background: "none", fontSize: 18, cursor: "pointer" }}>+</button>
                        </div>
                        <button
                            onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, sale_price: product.sale_price, thumbnail: product.thumbnail, slug: null }, qty)}
                            style={{ flex: 1, padding: "10px 20px", background: "#ff4d4f", color: "#fff", border: "none", borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: "pointer" }}
                        >
                            {lang === "vi" ? "Đặt hàng" : "Add to Cart"}
                        </button>
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

            {/* Reviews */}
            <ProductReviews productId={productId} lang={lang} />

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

function StarRating({ value, onChange, size = 20 }) {
    const [hover, setHover] = useState(0);
    return (
        <div style={{ display: "flex", gap: 2 }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() => onChange && setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    style={{ cursor: onChange ? "pointer" : "default", fontSize: size, color: star <= (hover || value) ? "#fadb14" : "#ddd" }}
                >★</span>
            ))}
        </div>
    );
}

function ProductReviews({ productId, lang }) {
    const [summary, setSummary] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ rating: 5, title: "", content: "" });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        api.get(`/products/${productId}/reviews/summary`).then((r) => setSummary(r.data));
        api.get(`/products/${productId}/reviews`).then((r) => setReviews(r.data?.data || []));
    }, [productId]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.content.trim()) return;
        setSubmitting(true);
        try {
            await api.post(`/products/${productId}/reviews`, form);
            setSubmitted(true);
            setShowForm(false);
            setForm({ rating: 5, title: "", content: "" });
        } catch {
            alert("Lỗi gửi đánh giá");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #2f456f" }}>
                {lang === "vi" ? "Đánh giá sản phẩm" : "Customer Reviews"}
                {summary?.total > 0 && <span style={{ fontWeight: 400, fontSize: 14, color: "#999" }}> ({summary.total})</span>}
            </h2>

            {/* Summary */}
            {summary && summary.total > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 20, padding: 16, background: "#f9f9f9", borderRadius: 8 }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 36, fontWeight: 700, color: "#2f456f" }}>{summary.average}</div>
                        <StarRating value={Math.round(summary.average)} size={16} />
                        <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>{summary.total} {lang === "vi" ? "đánh giá" : "reviews"}</div>
                    </div>
                    <div style={{ flex: 1, maxWidth: 300 }}>
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = summary.breakdown?.[star] || 0;
                            const pct = summary.total > 0 ? (count / summary.total) * 100 : 0;
                            return (
                                <div key={star} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                                    <span style={{ fontSize: 12, width: 16 }}>{star}★</span>
                                    <div style={{ flex: 1, height: 8, background: "#eee", borderRadius: 4, overflow: "hidden" }}>
                                        <div style={{ width: `${pct}%`, height: "100%", background: "#fadb14", borderRadius: 4 }} />
                                    </div>
                                    <span style={{ fontSize: 11, color: "#999", width: 20 }}>{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Review form */}
            {submitted ? (
                <div style={{ padding: 16, background: "#f0fdf0", borderRadius: 6, marginBottom: 16, color: "#389e0d" }}>
                    {lang === "vi" ? "Cảm ơn! Đánh giá của bạn đang chờ duyệt." : "Thank you! Your review is pending approval."}
                </div>
            ) : showForm ? (
                <form onSubmit={handleSubmit} style={{ padding: 16, border: "1px solid #eee", borderRadius: 8, marginBottom: 16 }}>
                    <div style={{ marginBottom: 12 }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{lang === "vi" ? "Đánh giá" : "Rating"}</label>
                        <StarRating value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} size={24} />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{lang === "vi" ? "Tiêu đề" : "Title"}</label>
                        <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder={lang === "vi" ? "Tóm tắt đánh giá..." : "Summary..."} style={{ width: "100%", padding: "6px 10px", border: "1px solid #ddd", borderRadius: 4, boxSizing: "border-box" }} />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{lang === "vi" ? "Nội dung *" : "Content *"}</label>
                        <textarea required value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={3} placeholder={lang === "vi" ? "Chia sẻ trải nghiệm của bạn..." : "Share your experience..."} style={{ width: "100%", padding: "6px 10px", border: "1px solid #ddd", borderRadius: 4, boxSizing: "border-box", resize: "vertical" }} />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button type="submit" disabled={submitting} style={{ padding: "8px 20px", background: "#2f456f", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>
                            {submitting ? "..." : (lang === "vi" ? "Gửi đánh giá" : "Submit")}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} style={{ padding: "8px 20px", background: "#f5f5f5", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}>
                            {lang === "vi" ? "Hủy" : "Cancel"}
                        </button>
                    </div>
                </form>
            ) : (
                <button onClick={() => setShowForm(true)} style={{ padding: "8px 20px", background: "#fff", border: "1px solid #2f456f", color: "#2f456f", borderRadius: 4, cursor: "pointer", fontWeight: 500, marginBottom: 16 }}>
                    {lang === "vi" ? "Viết đánh giá" : "Write a Review"}
                </button>
            )}

            {/* Review list */}
            {reviews.length > 0 ? (
                <div>
                    {reviews.map((r) => (
                        <div key={r.id} style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <StarRating value={r.rating} size={14} />
                                {r.title && <span style={{ fontWeight: 600 }}>{r.title}</span>}
                            </div>
                            <p style={{ margin: "4px 0", fontSize: 14, color: "#555", lineHeight: 1.5 }}>{r.content}</p>
                            <div style={{ fontSize: 12, color: "#999" }}>{new Date(r.created_at).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US")}</div>
                        </div>
                    ))}
                </div>
            ) : !submitted && (
                <p style={{ color: "#999", fontSize: 14 }}>{lang === "vi" ? "Chưa có đánh giá nào." : "No reviews yet."}</p>
            )}
        </div>
    );
}
