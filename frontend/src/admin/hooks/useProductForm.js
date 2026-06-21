import {

    useEffect,
    useState

} from "react";

import {

    getProduct,
    updateProduct,
    createProduct

} from "../../shared/services/productApi";

export default function useProductForm({

    productId

}) {

    const [

        product,

        setProduct

    ] = useState(null);

    const [

        loading,

        setLoading

    ] = useState(false);

    const saveProduct = async (
        values
    ) => {

        if (productId) {

            return updateProduct(
                productId,
                values
            );

        }

        return createProduct(
            values
        );

    };

    useEffect(() => {

        async function load() {

            setLoading(true);

            try {

                const productRes =

                    await getProduct(
                        productId
                    );

                setProduct(
                    productRes.data
                );

            } finally {

                setLoading(false);

            }

        }

        if (productId) {

            load();

        } else {

            setProduct(null);

        }

    }, [productId]);

    return {

        product,

        loading,

        saveProduct

    };

}