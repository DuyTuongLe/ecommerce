import api from "./api";

export async function getOrders({ page = 1, search, order_status, payment_status, per_page = 20 } = {}) {
    const { data } = await api.get("/admin/orders", {
        params: { page, search, order_status, payment_status, per_page },
    });
    return data;
}

export async function getOrder(id) {
    const { data } = await api.get(`/admin/orders/${id}`);
    return data;
}

export async function updateOrderStatus(id, payload) {
    const { data } = await api.put(`/admin/orders/${id}/status`, payload);
    return data;
}

export async function deleteOrder(id) {
    const { data } = await api.delete(`/admin/orders/${id}`);
    return data;
}

export async function bulkDeleteOrders(ids) {
    const { data } = await api.post("/admin/orders/bulk-delete", { ids });
    return data;
}
