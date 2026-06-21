// src/admin/hooks/useProducts.js

import { useState } from "react";

import {
    getProducts,
    getProductCategories,
    updateProductsStatus,
    deleteProducts
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

    const publishProducts = (

        ids

    ) => {

        return updateProductsStatus(

            ids,

            1

        );

    };

    const unpublishProducts = (

        ids

    ) => {

        return updateProductsStatus(

            ids,

            0

        );

    };

    const removeProducts = (
        ids
    ) => {

        return deleteProducts(
            ids
        );

    };

    return {

        products,
        categories,

        loading,

        fetchProducts,
        fetchCategories,

        publishProducts,
        unpublishProducts,

        removeProducts

    };

}