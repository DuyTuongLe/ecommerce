// src/admin/hooks/useProducts.js

import { useState } from "react";

import {
    getProducts
} from "../../shared/services/productApi";

export default function useProducts() {

    const [products, setProducts] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const fetchProducts = async (
        page = 1,
        lang = "vi"
    ) => {

        setLoading(true);

        try {

            const data =
                await getProducts(
                    page,
                    lang
                );

            setProducts(data);

        } finally {

            setLoading(false);

        }

    };

    return {
        products,
        loading,
        fetchProducts
    };
}