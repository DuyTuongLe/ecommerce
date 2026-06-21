// src/admin/pages/ProductCreatePage.jsx

import ProductForm
    from "../components/product/ProductForm";

import {
    useLanguages
} from "../hooks/useLanguages";

export default function ProductCreatePage() {

    const languages =
        useLanguages();

    return (

        <ProductForm

            mode="create"

            languages={languages}

        />

    );

}