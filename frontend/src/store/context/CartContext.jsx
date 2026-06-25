import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
const STORAGE_KEY = "cart_items";

function loadCart() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch { return []; }
}

function saveCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(loadCart);

    useEffect(() => { saveCart(items); }, [items]);

    function addToCart(product, qty = 1) {
        setItems((prev) => {
            const idx = prev.findIndex((i) => i.product_id === product.id);
            if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty };
                return updated;
            }
            return [...prev, {
                product_id: product.id,
                name: product.name,
                price: product.price,
                sale_price: product.sale_price,
                thumbnail: product.thumbnail,
                slug: product.slug,
                qty,
            }];
        });
    }

    function updateQty(productId, qty) {
        if (qty <= 0) return removeFromCart(productId);
        setItems((prev) => prev.map((i) => i.product_id === productId ? { ...i, qty } : i));
    }

    function removeFromCart(productId) {
        setItems((prev) => prev.filter((i) => i.product_id !== productId));
    }

    function clearCart() {
        setItems([]);
    }

    const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = items.reduce((sum, i) => sum + (i.sale_price || i.price) * i.qty, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, updateQty, removeFromCart, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
