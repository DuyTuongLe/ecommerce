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

    const loadProduct = async () => {

        if (!productId) {
            return;
        }

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

    };

    const saveProduct = async (
        values
    ) => {

        let result;

        if (productId) {

            result =
                await updateProduct(
                    productId,
                    values
                );

            await loadProduct();

        } else {

            result =
                await createProduct(
                    values
                );

        }

        return result;

    };

    useEffect(() => {

        if (productId) {

            loadProduct();

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