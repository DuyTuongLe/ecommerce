import api from "./api";

export async function getPromotions(params = {}) {
    const { data } = await api.get("/admin/promotions", { params });
    return data;
}

export async function getPromotion(id) {
    const { data } = await api.get(`/admin/promotions/${id}`);
    return data;
}

export async function createPromotion(payload) {
    const { data } = await api.post("/admin/promotions", payload);
    return data;
}

export async function updatePromotion(id, payload) {
    const { data } = await api.put(`/admin/promotions/${id}`, payload);
    return data;
}

export async function deletePromotion(id) {
    const { data } = await api.delete(`/admin/promotions/${id}`);
    return data;
}

export async function bulkDeletePromotions(ids) {
    const { data } = await api.post("/admin/promotions/bulk-delete", { ids });
    return data;
}
