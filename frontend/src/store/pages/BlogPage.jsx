import { Link } from "react-router-dom";

export default function BlogPage({ data, lang = "vi" }) {
    const prefix = lang === "vi" ? "" : `/${lang}`;
    const posts = data.posts?.data || [];
    const children = data.children || [];
    const pagination = data.posts || {};

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>{data.title}</h1>

            {/* Child categories */}
            {children.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                    {children.map((cat) => (
                        <Link
                            key={cat.id}
                            to={cat.slug ? `${prefix}/${cat.slug}` : "#"}
                            style={{
                                padding: "6px 16px",
                                border: "1px solid #ddd",
                                borderRadius: 20,
                                textDecoration: "none",
                                color: "#333",
                                fontSize: 14,
                            }}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            )}

            {/* Post list */}
            {posts.length === 0 ? (
                <p style={{ color: "#999" }}>{lang === "vi" ? "Chưa có bài viết" : "No posts yet"}</p>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                    {posts.map((post) => {
                        const link = post.slug ? `${prefix}/${post.slug}` : "#";
                        return (
                            <div key={post.id} style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                                <Link to={link} style={{ textDecoration: "none", color: "inherit" }}>
                                    <div style={{ aspectRatio: "16/9", background: "#f5f5f5", overflow: "hidden" }}>
                                        {post.thumbnail ? (
                                            <img src={post.thumbnail} alt={post.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc" }}>No image</div>
                                        )}
                                    </div>
                                </Link>
                                <div style={{ padding: 12, flex: 1, display: "flex", flexDirection: "column" }}>
                                    <Link to={link} style={{ textDecoration: "none", color: "inherit" }}>
                                        <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 6px", lineHeight: 1.4 }}>{post.title}</h3>
                                    </Link>
                                    {post.excerpt && (
                                        <p style={{ fontSize: 13, color: "#666", margin: "0 0 8px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                            {post.excerpt}
                                        </p>
                                    )}
                                    <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: 12, color: "#999" }}>
                                            {new Date(post.created_at).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US")}
                                        </span>
                                        <Link
                                            to={link}
                                            style={{
                                                fontSize: 13,
                                                color: "#2f456f",
                                                textDecoration: "none",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {lang === "vi" ? "Chi tiết →" : "Read more →"}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {pagination.last_page > 1 && (
                <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 24 }}>
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((p) => (
                        <span
                            key={p}
                            style={{
                                padding: "6px 12px",
                                border: "1px solid #ddd",
                                borderRadius: 4,
                                background: p === pagination.current_page ? "#2f456f" : "#fff",
                                color: p === pagination.current_page ? "#fff" : "#333",
                                fontSize: 14,
                            }}
                        >
                            {p}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
