import api from "./api";

export async function getNoiDungs(params = {}) {
    const { data } = await api.get("/admin/noi-dung", { params });
    return data;
}

export async function getNoiDung(id) {
    const { data } = await api.get(`/admin/noi-dung/${id}`);
    return data;
}

export async function createNoiDung(payload) {
    const { data } = await api.post("/admin/noi-dung", payload);
    return data;
}

export async function updateNoiDung(id, payload) {
    const { data } = await api.put(`/admin/noi-dung/${id}`, payload);
    return data;
}

export async function deleteNoiDungs(ids) {
    const { data } = await api.post("/admin/noi-dung/bulk-delete", { ids });
    return data;
}

export async function getNoiDungPages(lang = "vi") {
    const { data } = await api.get("/admin/noi-dung/pages", { params: { lang } });
    return data;
}

export async function toggleNoiDungStatus(id, trangthai) {
    const { data } = await api.post(`/admin/noi-dung/toggle-status`, { id, trangthai: trangthai ? 1 : 0 });
    return data;
}

export async function reorderNoiDungs(items) {
    const { data } = await api.post("/admin/noi-dung/reorder", { items });
    return data;
}
