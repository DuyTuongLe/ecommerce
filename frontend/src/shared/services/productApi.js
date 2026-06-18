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

export async function getProduct(
    id,
    lang = "vi"
) {

    const { data } = await api.get(

        `/admin/products/${id}`,

        {
            params: {
                lang
            }
        }

    );

    return data;
}

export async function updateProduct(
    id,
    data
) {

    const res = await api.put(

        `/admin/products/${id}`,

        data

    );

    return res.data;

}

export async function getProductFormOptions(
    lang = "vi"
) {

    const { data } = await api.get(

        "/admin/product-form-options",

        {
            params: {
                lang
            }
        }

    );

    return data;
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

export async function getBrands(
    lang = "vi"
) {

    const res = await api.get(
        "/admin/brands",
        {
            params: { lang }
        }
    );

    return res.data;
}

export async function deleteBrand(
    id
) {

    const res = await api.delete(
        `/admin/brands/${id}`
    );

    return res.data;
}

export async function saveBrands(
    rows,
    lang = "vi"
) {

    const { data } = await api.post(

        "/admin/brands/bulk-save",

        {

            rows,

            lang

        }

    );

    return data;

}

export async function createBrand(
    lang = "vi"
) {

    const { data } = await api.post(

        "/admin/brands",

        {
            lang
        }

    );

    return data;
}

export async function deleteBrands(ids) {

    const { data } = await api.post(
        "/admin/brands/bulk-delete",
        {
            ids
        }
    );

    return data;

}

export async function getAttributes(
    lang = "vi"
) {

    const res = await api.get(

        "/admin/attributes",

        {
            params: {
                lang
            }
        }

    );

    return res.data;

}

export async function getAttributeValues(
    lang = "vi"
) {

    const res = await api.get(

        "/admin/attributevalues",

        {
            params: {
                lang
            }
        }

    );

    return res.data;
}

export async function saveAttributes(

    rows,

    lang = "vi"

) {

    const { data } = await api.post(

        "/admin/attributes/bulk-save",

        {

            rows,

            lang

        }

    );

    return data;

}

export async function createAttribute(
    lang = "vi"
) {

    const { data } = await api.post(

        "/admin/attributes",

        {
            lang
        }

    );

    return data;

}

export async function deleteAttributes(ids) {

    const { data } = await api.post(

        "/admin/attributes/bulk-delete",

        {
            ids
        }

    );

    return data;

}


export async function createAttributeValue(
    lang = "vi"
) {

    const { data } = await api.post(

        "/admin/attributevalues",

        {
            lang
        }

    );

    return data;

}

export async function saveAttributeValues(

    rows,

    lang = "vi"

) {

    const { data } = await api.post(

        "/admin/attributevalues/bulk-save",

        {

            rows,

            lang

        }

    );

    return data;

}

export async function deleteAttributeValues(
    ids
) {

    const { data } = await api.post(

        "/admin/attributevalues/bulk-delete",

        {
            ids
        }

    );

    return data;

}