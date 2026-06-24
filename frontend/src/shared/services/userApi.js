import api from "./api";

export async function getUsers() {
    const { data } = await api.get("/admin/users");
    return data;
}

export async function createUser(userData) {
    const { data } = await api.post("/admin/users", userData);
    return data;
}

export async function updateUser(id, userData) {
    const { data } = await api.put(`/admin/users/${id}`, userData);
    return data;
}

export async function changePassword(id, passwordData) {
    const { data } = await api.put(`/admin/users/${id}/password`, passwordData);
    return data;
}

export async function deleteUser(id) {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
}

export async function bulkDeleteUsers(ids) {
    const { data } = await api.post("/admin/users/bulk-delete", { ids });
    return data;
}
