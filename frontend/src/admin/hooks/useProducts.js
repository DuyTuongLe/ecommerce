// src/admin/hooks/useProducts.js

import { useState, useCallback, useRef } from "react";

import {
    getProducts,
    getProductCategories,
    updateProductsStatus,
    deleteProducts
} from "../../shared/services/productApi";

export default function useProducts() {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const abortRef = useRef(null);

    const fetchProducts = useCallback(async ({
        page = 1,
        lang = "vi",
        categoryId = null,
        status,
        search
    } = {}) => {

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);

        try {
            const data = await getProducts({
                page,
                lang,
                categoryId,
                status,
                search
            });

            if (!controller.signal.aborted) {
                setProducts(data);
            }
        } catch (error) {
            if (error?.name !== "CanceledError") {
                console.error(error);
            }
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    }, []);

    const fetchCategories = useCallback(async (lang = "vi") => {
        try {
            const data = await getProductCategories(lang);
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const publishProducts = useCallback(
        (ids) => updateProductsStatus(ids, 1),
        []
    );

    const unpublishProducts = useCallback(
        (ids) => updateProductsStatus(ids, 0),
        []
    );

    const removeProducts = useCallback(
        (ids) => deleteProducts(ids),
        []
    );

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
