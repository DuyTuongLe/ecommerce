// src/admin/hooks/useBrands.js

import { useState, useCallback } from "react";

import {
    getBrands,
    saveBrands,
    createBrand as createBrandApi,
    deleteBrands as deleteBrandsApi
} from "../../shared/services/productApi";

export default function useBrands() {

    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchBrands = useCallback(async (lang = "vi") => {
        setLoading(true);
        try {
            const data = await getBrands(lang);
            setBrands(data);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveBrandChanges = useCallback(async (rows, lang = "vi") => {
        try {
            await saveBrands(rows, lang);
            await fetchBrands(lang);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }, [fetchBrands]);

    const createBrand = useCallback(async (lang = "vi") => {
        try {
            const data = await createBrandApi(lang);
            await fetchBrands(lang);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }, [fetchBrands]);

    const deleteBrands = useCallback(async (ids, lang = "vi") => {
        try {
            const data = await deleteBrandsApi(ids);
            await fetchBrands(lang);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }, [fetchBrands]);

    return {
        brands,
        loading,
        fetchBrands,
        saveBrandChanges,
        createBrand,
        deleteBrands
    };
}
