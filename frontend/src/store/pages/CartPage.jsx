import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { usePageContext } from "../context/PageContext";
import { placeOrder, applyCoupon } from "../../shared/services/storeApi";

function fmt(v) { return v ? Number(v).toLocaleString("vi-VN") + "₫" : "0₫"; }

export default function CartPage({ lang = "vi" }) {
    const { items, updateQty, removeFromCart, clearCart, totalPrice } = useCart();
    const { setBreadcrumbs } = usePageContext();
    const [step, setStep] = useState("cart");
    const [form, setForm] = useState({ customer_name: "", customer_phone: "", customer_email: "", shipping_address: "", shipping_city: "", note: "", payment_method: "cod" });
    const [submitting, setSubmitting] = useState(false);
    const [orderResult, setOrderResult] = useState(null);
    const prefix = lang === "vi" ? "" : `/${lang}`;

    const [couponCode, setCouponCode] = useState("");
    const [coupon, setCoupon] = useState(null);
    const [couponError, setCouponError] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);

    const discount = coupon?.discount || 0;
    const grandTotal = Math.max(0, totalPrice - discount);

    useEffect(() => {
        setBreadcrumbs([{ title: lang === "vi" ? "Giỏ hàng" : "Cart", slug: null }]);
    }, [lang]);

    useEffect(() => {
        if (coupon) {
            setCouponLoading(true);
            applyCoupon(coupon.code, totalPrice)
                .then((res) => { setCoupon(res); setCouponError(""); })
                .catch(() => { setCoupon(null); setCouponError("Mã không còn hợp lệ"); })
                .finally(() => setCouponLoading(false));
        }
    }, [totalPrice]);

    function handleInput(key, value) { setForm((f) => ({ ...f, [key]: value })); }

    async function handleApplyCoupon() {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponError("");
        try {
            const res = await applyCoupon(couponCode.trim(), totalPrice);
            setCoupon(res);
            setCouponError("");
        } catch (err) {
            setCoupon(null);
            setCouponError(err.response?.data?.message || "Mã không hợp lệ");
        } finally {
            setCouponLoading(false);
        }
    }

    function removeCoupon() {
        setCoupon(null);
        setCouponCode("");
        setCouponError("");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.customer_name || !form.customer_phone || !form.shipping_address) return;
        setSubmitting(true);
        try {
            const res = await placeOrder({
                ...form,
                lang,
                coupon_code: coupon?.code || null,
                items: items.map((i) => ({ product_id: i.product_id, qty: i.qty })),
            });
            if (res.success) {
                setOrderResult(res);
                clearCart();
                setCoupon(null);
                setCouponCode("");
                setStep("success");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi đặt hàng");
        } finally {
            setSubmitting(false);
        }
    }

    if (step === "success") {
        return (
            <div style={{ maxWidth: 600, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                <h2>{lang === "vi" ? "Đặt hàng thành công!" : "Order placed!"}</h2>
                <p style={{ fontSize: 16, color: "#666", margin: "12px 0 24px" }}>
                    {lang === "vi" ? "Mã đơn hàng" : "Order code"}: <strong>{orderResult?.order_code}</strong>
                </p>
                <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                    <Link to={prefix || "/"} style={{ color: "#2f456f", fontWeight: 500 }}>
                        {lang === "vi" ? "← Về trang chủ" : "← Back to home"}
                    </Link>
                    <Link to={lang === "vi" ? "/tra-cuu-don-hang" : "/en/order-lookup"} style={{ color: "#2f456f", fontWeight: 500 }}>
                        {lang === "vi" ? "Tra cứu đơn hàng →" : "Track order →"}
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div style={{ maxWidth: 600, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
                <p style={{ fontSize: 16, color: "#999" }}>{lang === "vi" ? "Giỏ hàng trống" : "Cart is empty"}</p>
                <Link to={`${prefix}/${lang === "vi" ? "san-pham" : "products"}`} style={{ color: "#2f456f", fontWeight: 500 }}>
                    {lang === "vi" ? "← Tiếp tục mua sắm" : "← Continue shopping"}
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>{lang === "vi" ? "Giỏ hàng" : "Shopping Cart"}</h1>

            <div style={{ display: "grid", gridTemplateColumns: step === "checkout" ? "1fr 1fr" : "1fr", gap: 24 }}>
                {/* Cart items */}
                <div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                                <th style={{ padding: 8 }}>{lang === "vi" ? "Sản phẩm" : "Product"}</th>
                                <th style={{ padding: 8, width: 100 }}>{lang === "vi" ? "Giá" : "Price"}</th>
                                <th style={{ padding: 8, width: 100 }}>{lang === "vi" ? "SL" : "Qty"}</th>
                                <th style={{ padding: 8, width: 100 }}>{lang === "vi" ? "Tổng" : "Total"}</th>
                                <th style={{ padding: 8, width: 40 }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => {
                                const price = item.sale_price || item.price;
                                return (
                                    <tr key={item.product_id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                        <td style={{ padding: 8, display: "flex", alignItems: "center", gap: 10 }}>
                                            {item.thumbnail && <img src={item.thumbnail} alt="" style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }} />}
                                            <div>
                                                {item.slug ? <Link to={`${prefix}/${item.slug}`} style={{ color: "#333", textDecoration: "none", fontWeight: 500 }}>{item.name}</Link> : item.name}
                                            </div>
                                        </td>
                                        <td style={{ padding: 8 }}>{fmt(price)}</td>
                                        <td style={{ padding: 8 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                <button onClick={() => updateQty(item.product_id, item.qty - 1)} style={{ width: 28, height: 28, border: "1px solid #ddd", borderRadius: 4, background: "#fff", cursor: "pointer" }}>−</button>
                                                <span style={{ width: 30, textAlign: "center" }}>{item.qty}</span>
                                                <button onClick={() => updateQty(item.product_id, item.qty + 1)} style={{ width: 28, height: 28, border: "1px solid #ddd", borderRadius: 4, background: "#fff", cursor: "pointer" }}>+</button>
                                            </div>
                                        </td>
                                        <td style={{ padding: 8, fontWeight: 600 }}>{fmt(price * item.qty)}</td>
                                        <td style={{ padding: 8 }}>
                                            <button onClick={() => removeFromCart(item.product_id)} style={{ border: "none", background: "none", color: "#ff4d4f", cursor: "pointer", fontSize: 16 }}>×</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Coupon */}
                    <div style={{ marginTop: 16, padding: 12, background: "#f9f9f9", borderRadius: 6, border: "1px solid #eee" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                            {lang === "vi" ? "Mã giảm giá" : "Coupon code"}
                        </div>
                        {coupon ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{
                                    padding: "4px 12px",
                                    background: "#f0fdf0",
                                    border: "1px solid #b7eb8f",
                                    borderRadius: 4,
                                    fontWeight: 600,
                                    fontFamily: "monospace",
                                    color: "#389e0d",
                                }}>
                                    {coupon.code}
                                </span>
                                <span style={{ color: "#389e0d", fontSize: 13 }}>{coupon.description} (−{fmt(discount)})</span>
                                <button onClick={removeCoupon} style={{ border: "none", background: "none", color: "#ff4d4f", cursor: "pointer", fontSize: 14 }}>×</button>
                            </div>
                        ) : (
                            <div style={{ display: "flex", gap: 8 }}>
                                <input
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                                    placeholder={lang === "vi" ? "Nhập mã giảm giá..." : "Enter coupon code..."}
                                    style={{
                                        flex: 1, padding: "6px 10px", border: "1px solid #ddd",
                                        borderRadius: 4, fontFamily: "monospace", fontWeight: 500,
                                        textTransform: "uppercase", boxSizing: "border-box",
                                    }}
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={couponLoading}
                                    style={{
                                        padding: "6px 16px", background: "#2f456f", color: "#fff",
                                        border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 500,
                                    }}
                                >
                                    {couponLoading ? "..." : (lang === "vi" ? "Áp dụng" : "Apply")}
                                </button>
                            </div>
                        )}
                        {couponError && <div style={{ color: "#ff4d4f", fontSize: 12, marginTop: 4 }}>{couponError}</div>}
                    </div>

                    {/* Total */}
                    <div style={{ marginTop: 16, padding: "12px 0", borderTop: "2px solid #eee" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span>{lang === "vi" ? "Tạm tính" : "Subtotal"}</span>
                            <span>{fmt(totalPrice)}</span>
                        </div>
                        {discount > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: "#389e0d" }}>
                                <span>{lang === "vi" ? "Giảm giá" : "Discount"}</span>
                                <span>−{fmt(discount)}</span>
                            </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                            <span style={{ fontSize: 18, fontWeight: 700 }}>{lang === "vi" ? "Tổng cộng" : "Total"}: {fmt(grandTotal)}</span>
                            {step === "cart" && (
                                <button onClick={() => setStep("checkout")} style={{ padding: "10px 28px", background: "#2f456f", color: "#fff", border: "none", borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                                    {lang === "vi" ? "Tiến hành đặt hàng" : "Checkout"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Checkout form */}
                {step === "checkout" && (
                    <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 20 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{lang === "vi" ? "Thông tin đặt hàng" : "Order Information"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ display: "block", fontSize: 13, marginBottom: 4, fontWeight: 500 }}>{lang === "vi" ? "Họ tên *" : "Full name *"}</label>
                                <input required value={form.customer_name} onChange={(e) => handleInput("customer_name", e.target.value)} style={{ width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 4, boxSizing: "border-box" }} />
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ display: "block", fontSize: 13, marginBottom: 4, fontWeight: 500 }}>{lang === "vi" ? "Số điện thoại *" : "Phone *"}</label>
                                <input required value={form.customer_phone} onChange={(e) => handleInput("customer_phone", e.target.value)} style={{ width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 4, boxSizing: "border-box" }} />
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ display: "block", fontSize: 13, marginBottom: 4, fontWeight: 500 }}>Email</label>
                                <input type="email" value={form.customer_email} onChange={(e) => handleInput("customer_email", e.target.value)} style={{ width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 4, boxSizing: "border-box" }} />
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ display: "block", fontSize: 13, marginBottom: 4, fontWeight: 500 }}>{lang === "vi" ? "Địa chỉ giao hàng *" : "Shipping address *"}</label>
                                <textarea required value={form.shipping_address} onChange={(e) => handleInput("shipping_address", e.target.value)} rows={2} style={{ width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 4, boxSizing: "border-box", resize: "vertical" }} />
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ display: "block", fontSize: 13, marginBottom: 4, fontWeight: 500 }}>{lang === "vi" ? "Ghi chú" : "Note"}</label>
                                <textarea value={form.note} onChange={(e) => handleInput("note", e.target.value)} rows={2} style={{ width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 4, boxSizing: "border-box", resize: "vertical" }} />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: "block", fontSize: 13, marginBottom: 4, fontWeight: 500 }}>{lang === "vi" ? "Thanh toán" : "Payment"}</label>
                                <select value={form.payment_method} onChange={(e) => handleInput("payment_method", e.target.value)} style={{ width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 4 }}>
                                    <option value="cod">{lang === "vi" ? "Thanh toán khi nhận hàng (COD)" : "Cash on Delivery"}</option>
                                    <option value="bank">{lang === "vi" ? "Chuyển khoản ngân hàng" : "Bank Transfer"}</option>
                                </select>
                            </div>

                            {/* Order summary in checkout */}
                            <div style={{ padding: 12, background: "#f9f9f9", borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <span>{lang === "vi" ? "Tạm tính" : "Subtotal"}</span>
                                    <span>{fmt(totalPrice)}</span>
                                </div>
                                {discount > 0 && (
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: "#389e0d" }}>
                                        <span>{coupon?.description || "Giảm giá"}</span>
                                        <span>−{fmt(discount)}</span>
                                    </div>
                                )}
                                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, borderTop: "1px solid #ddd", paddingTop: 8, marginTop: 4 }}>
                                    <span>{lang === "vi" ? "Tổng" : "Total"}</span>
                                    <span style={{ color: "#ff4d4f" }}>{fmt(grandTotal)}</span>
                                </div>
                            </div>

                            <button type="submit" disabled={submitting} style={{ width: "100%", padding: "12px", background: "#ff4d4f", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                                {submitting ? "..." : (lang === "vi" ? "Đặt hàng" : "Place Order")}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
