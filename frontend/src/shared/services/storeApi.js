import api from "./api";

export async function getHomePage(lang = "vi") {
    const { data } = await api.get("/page/home", { params: { lang } });
    return data;
}

export async function getPageBySlug(slug, lang = "vi") {
    const { data } = await api.get(`/page/${slug}`, { params: { lang } });
    return data;
}

export async function getSettings() {
    const { data } = await api.get("/settings");
    return data;
}

export async function saveCssVariables(cssVariables) {
    const { data } = await api.post("/settings/css-variables", { css_variables: cssVariables });
    return data;
}

export async function getHeaderMenu(lang = "vi") {
    const { data } = await api.get("/menus/header", { params: { lang } });
    return data;
}

export async function getStoreProducts({ lang = "vi", category_id, brand_id, search, page = 1, sort, limit, attrs } = {}) {
    const params = { lang, category_id, brand_id, search, page, sort, limit };
    if (attrs) {
        for (const [attrId, valueIds] of Object.entries(attrs)) {
            if (valueIds.length > 0) params[`attrs[${attrId}]`] = valueIds.join(",");
        }
    }
    const { data } = await api.get("/products", { params });
    return data;
}

export async function getProductDetail(id, lang = "vi") {
    const { data } = await api.get(`/products/${id}`, { params: { lang } });
    return data;
}

export async function getStoreBrands(lang = "vi") {
    const { data } = await api.get("/brands", { params: { lang } });
    return data;
}

export async function getProductCategories(lang = "vi") {
    const { data } = await api.get("/product-categories", { params: { lang } });
    return data;
}

export async function getStoreAttributes(lang = "vi") {
    const { data } = await api.get("/attributes", { params: { lang } });
    return data;
}
