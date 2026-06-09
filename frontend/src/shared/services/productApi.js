// src/shared/services/productApi.js

import api from "./api";

export async function getProducts(
    page = 1,
    lang = "vi"
) {

    const res = await api.get(
        "/admin/products",
        {
            params: {
                page,
                lang
            }
        }
    );

    return res.data;
}