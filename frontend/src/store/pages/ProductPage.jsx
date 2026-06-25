import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getStoreProducts, getProductCategories, getStoreAttributes } from "../../shared/services/storeApi";
import { usePageContext } from "../context/PageContext";
import { useCart } from "../context/CartContext";
import { getCached, setCached } from "../utils/cache";
import BrandFilter from "../components/BrandFilter";

function CategoryTree({ categories, activeId, lang, level = 0 }) {
    const prefix = lang === "vi" ? "" : `/${lang}`;
    return (
        <ul style={{ listStyle: "none", padding: level > 0 ? "0 0 0 16px" : 0, margin: 0 }}>
            {categories.map((cat) => (
                <li key={cat.id} style={{ marginBottom: 4 }}>
                    <Link
                        to={cat.slug ? `${prefix}/${cat.slug}` : `${prefix}/${lang === "vi" ? "san-pham" : "products"}?category=${cat.id}`}
                        style={{
                            display: "block",
                            padding: "6px 8px",
                            textDecoration: "none",
                            color: cat.id === activeId ? "#fff" : "#333",
                            background: cat.id === activeId ? "#2f456f" : "transparent",
                            borderRadius: 4,
                        }}
                    >
                        {cat.name}
                    </Link>
                    {cat.children && (
                        <CategoryTree categories={cat.children} activeId={activeId} lang={lang} level={level + 1} />
                    )}
                </li>
            ))}
        </ul>
    );
}

const selectStyle = {
    padding: "4px 8px",
    border: "1px solid #ddd",
    borderRadius: 20,
    background: "#f8f9fa",
    fontSize: 13,
    outline: "none",
    cursor: "pointer",
};

const badgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "2px 10px",
    border: "1px solid #ddd",
    borderRadius: 20,
    fontSize: 12,
    background: "#fff",
};

export default function ProductPage({ lang = "vi", categoryIdOverride }) {
    const [searchParams] = useSearchParams();
    const categoryId = categoryIdOverride ? String(categoryIdOverride) : searchParams.get("category");
    const searchKeyword = searchParams.get("search") || "";

    const [categories, setCategories] = useState(() => getCached(`product_categories_${lang}`) || []);
    const [attributes, setAttributes] = useState(() => getCached(`product_attributes_${lang}`) || []);
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [brandId, setBrandId] = useState(null);
    const [brandName, setBrandName] = useState("");
    const [sort, setSort] = useState("newest");
    const [limit, setLimit] = useState(12);
    const [selectedAttrs, setSelectedAttrs] = useState({});
    const [filtersOpen, setFiltersOpen] = useState(false);
    const { setBreadcrumbs } = usePageContext();

    useEffect(() => {
        getProductCategories(lang).then((d) => { setCategories(d); setCached(`product_categories_${lang}`, d); });
        getStoreAttributes(lang).then((d) => { setAttributes(d); setCached(`product_attributes_${lang}`, d); });
    }, [lang]);

    useEffect(() => { setPage(1); }, [categoryId, brandId, sort, limit, selectedAttrs, searchKeyword]);

    useEffect(() => {
        setLoading(true);
        const attrsParam = {};
        for (const [k, v] of Object.entries(selectedAttrs)) {
            if (v.length > 0) attrsParam[k] = v;
        }
        getStoreProducts({
            lang,
            category_id: categoryId || undefined,
            brand_id: brandId || undefined,
            search: searchKeyword || undefined,
            page, sort, limit,
            attrs: Object.keys(attrsParam).length > 0 ? attrsParam : undefined,
        })
            .then((res) => {
                setProducts(res.data || []);
                setPagination({ current: res.current_page, last: res.last_page, total: res.total });
            })
            .finally(() => setLoading(false));
    }, [lang, categoryId, brandId, page, sort, limit, selectedAttrs, searchKeyword]);

    useEffect(() => {
        const crumbs = [{ title: lang === "vi" ? "Sản phẩm" : "Products", slug: null }];
        if (categoryId) {
            const found = findCat(categories, Number(categoryId));
            if (found) {
                crumbs[0].slug = lang === "vi" ? "san-pham" : "products";
                crumbs.push({ title: found.name, slug: null });
            }
        }
        setBreadcrumbs(crumbs);
    }, [categoryId, categories, lang]);

    function handleBrandSelect(id, name) {
        setBrandId(id);
        setBrandName(name || "");
    }

    function toggleAttrValue(attrId, valueId) {
        setSelectedAttrs((prev) => {
            const current = prev[attrId] || [];
            const next = current.includes(valueId)
                ? current.filter((v) => v !== valueId)
                : [...current, valueId];
            return { ...prev, [attrId]: next };
        });
    }

    function removeAttrFilter(attrId) {
        setSelectedAttrs((prev) => {
            const next = { ...prev };
            delete next[attrId];
            return next;
        });
    }

    const hasActiveAttrs = Object.values(selectedAttrs).some((v) => v.length > 0);
    const hasActiveFilters = (brandId && brandName) || hasActiveAttrs;

    const { addToCart } = useCart();
    const prefix = lang === "vi" ? "" : `/${lang}`;
    const catName = categoryId ? findCat(categories, Number(categoryId))?.name : null;
    const contextLabel = catName || (lang === "vi" ? "Sản phẩm" : "Products");

    return (
        <>
            <BrandFilter lang={lang} activeBrandId={brandId} onSelect={handleBrandSelect} />
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "3fr 9fr", gap: 24 }}>
                    {/* Sidebar 3 cột */}
                    <div style={{ borderRight: "1px solid #eee", paddingRight: 16 }}>
                        <h3 style={{ margin: "0 0 12px" }}>{lang === "vi" ? "Danh mục sản phẩm" : "Categories"}</h3>
                        <CategoryTree categories={categories} activeId={categoryId ? Number(categoryId) : null} lang={lang} />
                    </div>

                    {/* Products 9 cột */}
                    <div>
                        {/* Toolbar */}
                        <div style={{
                            background: "#fff",
                            border: "1px solid #eee",
                            borderRadius: 6,
                            padding: "10px 14px",
                            marginBottom: 16,
                        }}>
                            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                                <div style={{ flex: 1, fontSize: 14 }}>
                                    {lang === "vi" ? "Có" : ""} <strong>{pagination.total || 0}</strong> {lang === "vi" ? "sản phẩm trong" : "products in"} <strong>{contextLabel}</strong>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <button
                                        onClick={() => setFiltersOpen((o) => !o)}
                                        style={{
                                            ...selectStyle,
                                            display: "flex", alignItems: "center", gap: 4,
                                            background: filtersOpen ? "#2f456f" : "#f8f9fa",
                                            color: filtersOpen ? "#fff" : "#333",
                                            border: filtersOpen ? "1px solid #2f456f" : "1px solid #ddd",
                                        }}
                                    >
                                        ☰ {lang === "vi" ? "Tùy chọn" : "Filters"}
                                    </button>
                                    <select value={sort} onChange={(e) => setSort(e.target.value)} style={selectStyle}>
                                        <option value="newest">{lang === "vi" ? "Mới nhất" : "Newest"}</option>
                                        <option value="oldest">{lang === "vi" ? "Cũ nhất" : "Oldest"}</option>
                                        <option value="price_asc">{lang === "vi" ? "Giá tăng" : "Price ↑"}</option>
                                        <option value="price_desc">{lang === "vi" ? "Giá giảm" : "Price ↓"}</option>
                                        <option value="az">A → Z</option>
                                        <option value="za">Z → A</option>
                                    </select>
                                    <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} style={selectStyle}>
                                        <option value={12}>12 {lang === "vi" ? "sản phẩm" : "items"}</option>
                                        <option value={24}>24 {lang === "vi" ? "sản phẩm" : "items"}</option>
                                        <option value={48}>48 {lang === "vi" ? "sản phẩm" : "items"}</option>
                                        <option value={96}>96 {lang === "vi" ? "sản phẩm" : "items"}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Active filters */}
                            {hasActiveFilters && (
                                <div style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", borderTop: "1px solid #f0f0f0", paddingTop: 8, marginTop: 8 }}>
                                    <span style={{ color: "#666" }}>{lang === "vi" ? "Đang lọc:" : "Filters:"}</span>
                                    {brandId && brandName && (
                                        <span style={badgeStyle}>
                                            {lang === "vi" ? "Thương hiệu" : "Brand"}: {brandName}
                                            <span onClick={() => handleBrandSelect(null, "")} style={{ cursor: "pointer", color: "#999", fontSize: 14, lineHeight: 1 }}>×</span>
                                        </span>
                                    )}
                                    {attributes.map((attr) => {
                                        const selected = selectedAttrs[attr.id] || [];
                                        if (selected.length === 0) return null;
                                        const names = selected.map((vid) => attr.values.find((v) => v.id === vid)?.name).filter(Boolean).join(", ");
                                        return (
                                            <span key={attr.id} style={badgeStyle}>
                                                {attr.name}: {names}
                                                <span onClick={() => removeAttrFilter(attr.id)} style={{ cursor: "pointer", color: "#999", fontSize: 14, lineHeight: 1 }}>×</span>
                                            </span>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Attribute filters panel */}
                            {filtersOpen && attributes.length > 0 && (
                                <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 10, marginTop: 8, display: "flex", flexWrap: "wrap", gap: 10 }}>
                                    {attributes.map((attr) => (
                                        <div key={attr.id} style={{ border: "1px solid #eee", borderRadius: 6, padding: "8px 12px", minWidth: 140 }}>
                                            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{attr.name}</div>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                                {attr.values.map((val) => {
                                                    const isActive = (selectedAttrs[attr.id] || []).includes(val.id);
                                                    return (
                                                        <label key={val.id} style={{
                                                            display: "inline-flex", alignItems: "center", gap: 4,
                                                            padding: "3px 8px", borderRadius: 4,
                                                            border: isActive ? "1px solid #2f456f" : "1px solid #ddd",
                                                            background: isActive ? "#eef2ff" : "#fff",
                                                            fontSize: 12, cursor: "pointer",
                                                        }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isActive}
                                                                onChange={() => toggleAttrValue(attr.id, val.id)}
                                                                style={{ display: "none" }}
                                                            />
                                                            {val.color_code && (
                                                                <span style={{
                                                                    width: 14, height: 14, borderRadius: "50%",
                                                                    background: val.color_code,
                                                                    border: "1px solid #ccc", flexShrink: 0,
                                                                }} />
                                                            )}
                                                            {val.name}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {loading ? (
                            <p>Loading...</p>
                        ) : products.length === 0 ? (
                            <p>{lang === "vi" ? "Không có sản phẩm" : "No products"}</p>
                        ) : (
                            <>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                                    {products.map((p) => (
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
                                                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 4 }}>
                                                            <span style={{ color: "red", fontWeight: 700 }}>{Number(p.sale_price).toLocaleString("vi-VN")}₫</span>
                                                            <span style={{ textDecoration: "line-through", color: "#999", fontSize: 13 }}>{Number(p.price).toLocaleString("vi-VN")}₫</span>
                                                            {p.discount_type === "percent" && p.discount_percent > 0 && (
                                                                <span style={{ fontSize: 11, background: "red", color: "#fff", padding: "1px 4px", borderRadius: 3 }}>-{Number(p.discount_percent)}%</span>
                                                            )}
                                                            {p.discount_type === "fixed" && p.discount_amount > 0 && (
                                                                <span style={{ fontSize: 11, background: "red", color: "#fff", padding: "1px 4px", borderRadius: 3 }}>-{Number(p.discount_amount).toLocaleString("vi-VN")}₫</span>
                                                            )}
                                                        </div>
                                                    ) : p.price ? (
                                                        <span style={{ fontWeight: 700 }}>{Number(p.price).toLocaleString("vi-VN")}₫</span>
                                                    ) : null}
                                                </div>
                                                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                                                    {p.slug && (
                                                        <Link to={`${prefix}/${p.slug}`} style={{ flex: 1, textAlign: "center", padding: "6px 0", border: "1px solid #2f456f", borderRadius: 4, color: "#2f456f", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
                                                            {lang === "vi" ? "Chi tiết" : "Detail"}
                                                        </Link>
                                                    )}
                                                    <button
                                                        onClick={() => addToCart({ id: p.id, name: p.name, price: p.price, sale_price: p.sale_price, thumbnail: p.thumbnail, slug: p.slug })}
                                                        style={{ flex: 1, padding: "6px 0", border: "none", borderRadius: 4, background: "#ff4d4f", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                                                    >
                                                        {lang === "vi" ? "Đặt hàng" : "Order"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {pagination.last > 1 && (
                                    <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 20 }}>
                                        {Array.from({ length: pagination.last }, (_, i) => i + 1).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                style={{
                                                    padding: "6px 12px",
                                                    border: "1px solid #ddd",
                                                    borderRadius: 4,
                                                    background: p === pagination.current ? "#2f456f" : "#fff",
                                                    color: p === pagination.current ? "#fff" : "#333",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

function findCat(cats, id) {
    for (const c of cats) {
        if (c.id === id) return c;
        if (c.children) { const f = findCat(c.children, id); if (f) return f; }
    }
    return null;
}
