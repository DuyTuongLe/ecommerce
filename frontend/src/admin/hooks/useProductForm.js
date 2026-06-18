import {

    useEffect,
    useState

} from "react";

import {

    getProduct,

    getProductFormOptions,

    updateProduct

} from "../../shared/services/productApi";

export default function useProductForm({

    productId,

    lang

}) {

    const [

        product,

        setProduct

    ] = useState(null);

    const [

        options,

        setOptions

    ] = useState(null);

    const saveProduct = async (
        values
    ) => {

        return updateProduct(
            productId,
            values
        );

    };

    const [

        loading,

        setLoading

    ] = useState(false);

    useEffect(() => {

        async function load() {

            setLoading(true);

            try {

                const [

                    productRes,

                    optionsRes

                ] = await Promise.all([

                    getProduct(
                        productId,
                        lang
                    ),

                    getProductFormOptions(
                        lang
                    )

                ]);

                setProduct(
                    productRes.data
                );

                setOptions(
                    optionsRes
                );

            } finally {

                setLoading(false);

            }

        }

        if (
            productId
        ) {

            load();

        }

    }, [

        productId,

        lang

    ]);

    return {

        product,

        options,

        loading,

        saveProduct

    };

}