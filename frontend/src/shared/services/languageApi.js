// src/shared/services/languageApi.js

import api from "./api";

// Lấy danh sách ngôn ngữ. Truyền all=true để lấy cả ngôn ngữ đang tắt
// (dùng cho trang quản lý).
export async function getLanguages(all = false) {
    const { data } = await api.get("/admin/languages", {
        params: all ? { all: 1 } : {},
    });
    return data;
}

export async function createLanguage(payload) {
    const { data } = await api.post("/admin/languages", payload);
    return data;
}

export async function updateLanguage(id, payload) {
    const { data } = await api.put(`/admin/languages/${id}`, payload);
    return data;
}

export async function deleteLanguage(id) {
    const { data } = await api.delete(`/admin/languages/${id}`);
    return data;
}
