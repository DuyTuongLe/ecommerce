// src/admin/hooks/useProducts.js

import { useState } from "react";

import {
    getProducts,
    getProductCategories
} from "../../shared/services/productApi";

export default function useProducts() {

    const [products, setProducts] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const fetchProducts = async ({

        page = 1,

        lang = "vi",

        categoryId = null

    } = {}) => {

        setLoading(true);

        try {

            const data =
                await getProducts({

                    page,

                    lang,

                    categoryId

                });

            setProducts(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const fetchCategories = async (
        lang = "vi"
    ) => {

        try {

            const data =
                await getProductCategories(
                    lang
                );

            setCategories(data);

        } catch (error) {

            console.error(error);

        }

    };

    return {

        products,
        categories,

        loading,

        fetchProducts,
        fetchCategories

    };

}