// shared/services/api.js
const API_URL = "http://localhost:8000/api";

export const api = {
  getMenu: ({ lang = "vi", type, root_id } = {}) => {
    const params = new URLSearchParams();

    if (lang) params.append("lang", lang);
    if (type) params.append("type", type);
    if (root_id) params.append("root_id", root_id);

    return request(`/menu?${params.toString()}`);
  },

  getMenuAdmin(lang, group) {
    const params = new URLSearchParams();

    if (lang) params.append("lang", lang);
    if (group) params.append("group", group);

    return request(`/admin/menu?${params.toString()}`);
  },

  createMenu: (data) =>
    request(`/admin/menu`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateMenu: (id, data) =>
    request(`/admin/menu/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteMenu: (id) =>
    request(`/admin/menu/${id}`, {
      method: "DELETE",
    }),

  reorderMenu: (items) =>
    request(`/admin/menu/reorder`, {
      method: "POST",
      body: JSON.stringify({ items }),
    }),

  getMenuGroup: () => request(`/admin/menu-group`),

};
async function request(url, options = {}) {
  const res = await fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }

  return res.json();
}