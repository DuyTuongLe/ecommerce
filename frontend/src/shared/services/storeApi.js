import api from "./api";

export async function getHomePage(lang = "vi") {
    const { data } = await api.get("/page/home", { params: { lang } });
    return data;
}

export async function getPageBySlug(slug, lang = "vi") {
    const { data } = await api.get(`/page/${slug}`, { params: { lang } });
    return data;
}

export async function getHeaderMenu(lang = "vi") {
    const { data } = await api.get("/menus/header", { params: { lang } });
    return data;
}
