// src/shared/services/productApi.js

import api from "./api";

export async function getProducts({

    page = 1,

    lang = "vi",

    categoryId = null

} = {}) {

    const res = await api.get(
        "/admin/products",
        {
            params: {

                page,

                lang,

                category_id:
                    categoryId

            }
        }
    );

    return res.data;
}

export async function getProductCategories(
    lang = "vi"
) {

    const res = await api.get(
        "/admin/product-categories",
        {
            params: { lang }
        }
    );

    return res.data;
}