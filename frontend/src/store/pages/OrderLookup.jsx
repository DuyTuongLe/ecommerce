import { useState, useEffect } from "react";
import { usePageContext } from "../context/PageContext";
import api from "../../shared/services/api";

function fmt(v) { return v ? Number(v).toLocaleString("vi-VN") + "₫" : "0₫"; }

const STATUS_MAP = {
    pending: { label: "Chờ xử lý", color: "#d48806", bg: "#fffbe6" },
    confirmed: { label: "Đã xác nhận", color: "#0958d9", bg: "#e6f4ff" },
    processing: { label: "Đang xử lý", color: "#08979c", bg: "#e6fffb" },
    shipping: { label: "Đang giao", color: "#531dab", bg: "#f9f0ff" },
    delivered: { label: "Đã giao", color: "#389e0d", bg: "#f6ffed" },
    cancelled: { label: "Đã hủy", color: "#cf1322", bg: "#fff1f0" },
    paid: { label: "Đã thanh toán", color: "#389e0d", bg: "#f6ffed" },
    refunded: { label: "Hoàn tiền", color: "#cf1322", bg: "#fff1f0" },
};

function StatusBadge({ status }) {
    const s = STATUS_MAP[status] || { label: status, color: "#666", bg: "#f5f5f5" };
    return <span style={{ padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, color: s.color, background: s.bg }}>{s.label}</span>;
}

export default function OrderLookup({ lang = "vi" }) {
    const { setBreadcrumbs } = usePageContext();
    const [orderCode, setOrderCode] = useState("");
    const [phone, setPhone] = useState("");
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setBreadcrumbs([{ title: lang === "vi" ? "Tra cứu đơn hàng" : "Order Lookup", slug: null }]);
    }, [lang]);

    async function handleSearch(e) {
        e.preventDefault();
        if (!orderCode && !phone) return;
        setLoading(true);
        setError("");
        setOrders(null);
        try {
            const { data } = await api.post("/orders/lookup", {
                order_code: orderCode || undefined,
                phone: phone || undefined,
            });
            setOrders(data);
        } catch (err) {
            setError(err.response?.data?.message || "Không tìm thấy đơn hàng");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
                {lang === "vi" ? "Tra cứu đơn hàng" : "Order Lookup"}
            </h1>

            <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
                <input
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                    placeholder={lang === "vi" ? "Mã đơn hàng (VD: ORD-...)" : "Order code"}
                    style={{ flex: 1, minWidth: 200, padding: "10px 14px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, fontFamily: "monospace" }}
                />
                <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={lang === "vi" ? "Số điện thoại" : "Phone number"}
                    style={{ flex: 1, minWidth: 160, padding: "10px 14px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14 }}
                />
                <button type="submit" disabled={loading} style={{ padding: "10px 24px", background: "#2f456f", color: "#fff", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                    {loading ? "..." : (lang === "vi" ? "Tra cứu" : "Search")}
                </button>
            </form>

            {error && <div style={{ padding: 16, background: "#fff1f0", borderRadius: 6, color: "#cf1322", marginBottom: 16 }}>{error}</div>}

            {orders && orders.map((order) => (
                <div key={order.id} style={{ border: "1px solid #eee", borderRadius: 8, marginBottom: 16, overflow: "hidden" }}>
                    {/* Header */}
                    <div style={{ padding: "12px 16px", background: "#f9f9f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                        <div>
                            <span style={{ fontWeight: 700, fontFamily: "monospace", fontSize: 15 }}>{order.order_code}</span>
                            <span style={{ marginLeft: 12, fontSize: 13, color: "#999" }}>
                                {new Date(order.created_at).toLocaleString(lang === "vi" ? "vi-VN" : "en-US")}
                            </span>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                            <StatusBadge status={order.order_status} />
                            <StatusBadge status={order.payment_status} />
                        </div>
                    </div>

                    {/* Items */}
                    <div style={{ padding: "0 16px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <tbody>
                                {order.items?.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                                        <td style={{ padding: "8px 0" }}>
                                            <div style={{ fontWeight: 500 }}>{item.product_name}</div>
                                            {item.product_sku && <div style={{ fontSize: 11, color: "#999" }}>SKU: {item.product_sku}</div>}
                                        </td>
                                        <td style={{ padding: 8, textAlign: "center", width: 60 }}>x{item.qty}</td>
                                        <td style={{ padding: 8, textAlign: "right", width: 120, fontWeight: 600 }}>{fmt(item.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Total */}
                    <div style={{ padding: "12px 16px", borderTop: "1px solid #eee", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 }}>
                        {Number(order.discount_total) > 0 && (
                            <span style={{ fontSize: 13, color: "#389e0d" }}>Giảm: −{fmt(order.discount_total)}</span>
                        )}
                        <span style={{ fontSize: 16, fontWeight: 700 }}>Tổng: {fmt(order.grand_total)}</span>
                    </div>

                    {/* Timeline */}
                    {order.histories?.length > 0 && (
                        <div style={{ padding: "8px 16px 12px", borderTop: "1px solid #f0f0f0" }}>
                            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: "#666" }}>Lịch sử</div>
                            {order.histories.map((h, i) => (
                                <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, marginBottom: 4 }}>
                                    <span style={{ color: "#999", whiteSpace: "nowrap" }}>{new Date(h.created_at).toLocaleString("vi-VN")}</span>
                                    <StatusBadge status={h.new_status} />
                                    {h.note && <span style={{ color: "#666" }}>{h.note}</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
