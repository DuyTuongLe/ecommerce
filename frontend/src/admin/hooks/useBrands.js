// src/admin/hooks/useBrands.js

import { useState } from "react";

import {

    getBrands,
    saveBrands,
    createBrand as createBrandApi,
    deleteBrands as deleteBrandsApi

} from "../../shared/services/productApi";

export default function useBrands() {

    const [brands, setBrands] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const fetchBrands = async (
        lang = "vi"
    ) => {

        setLoading(true);

        try {

            const data =
                await getBrands(
                    lang
                );

            setBrands(data);

        } finally {

            setLoading(false);

        }

    };

    const saveBrandChanges = async (

        rows,

        lang = "vi"

    ) => {

        try {

            await saveBrands(

                rows,

                lang

            );

            await fetchBrands(
                lang
            );

            return true;

        } catch (error) {

            console.error(
                error
            );

            return false;

        }

    };

    const createBrand = async (
        lang = "vi"
    ) => {

        try {

            const data =
                await createBrandApi();

            await fetchBrands(
                lang
            );

            return data;

        } catch (error) {

            console.error(
                error
            );

            return null;

        }

    };

    const deleteBrands = async (

    ids,

    lang = "vi"

) => {

    try {

        const data =

            await deleteBrandsApi(
                ids
            );

        await fetchBrands(
            lang
        );

        return data;

    } catch (error) {

        console.error(
            error
        );

        return null;

    }

};

    return {

        brands,

        loading,

        fetchBrands,

        saveBrandChanges,
        createBrand,
        deleteBrands

    };

}