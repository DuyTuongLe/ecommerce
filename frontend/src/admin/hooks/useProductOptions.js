// src/admin/hooks/useProductOptions.js

import {

    useEffect,
    useState

} from "react";

import {

    getProductFormOptions

} from "../../shared/services/productApi";

export default function useProductOptions(
    lang
) {

    const [

    options,

    setOptions

] = useState({

    brands: [],

    categories: [],

    attributes: []

});

    useEffect(() => {

        async function load() {

            const data =

                await getProductFormOptions(
                    lang
                );

            setOptions(
                data
            );

        }

        load();

    }, [

        lang

    ]);

    return options;

}