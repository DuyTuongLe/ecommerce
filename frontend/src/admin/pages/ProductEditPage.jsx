// src/admin/pages/ProductEditPage.jsx

import {

    useParams,
    useSearchParams

} from "react-router-dom";

import ProductForm
    from "../components/product/ProductForm";

export default function ProductEditPage() {

    const { id } =
        useParams();

    const [

        searchParams

    ] = useSearchParams();

    const lang =
        searchParams.get("lang")
        || "vi";

    return (

        <div
            style={{
                height: "100%"
            }}
        >

            <ProductForm

                mode="edit"

                productId={id}

                lang={lang}

            />

        </div>

    );

}