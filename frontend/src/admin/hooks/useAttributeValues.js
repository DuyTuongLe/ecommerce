// src/admin/hooks/useAttributeValues.js

import { useState } from "react";

import {

    getAttributeValues,

    getAttributes,

    createAttributeValue,

    saveAttributeValues,

    deleteAttributeValues

} from "../../shared/services/productApi";

export default function useAttributeValues() {

    const [

        attributeValues,

        setAttributeValues

    ] = useState([]);

    const [

        attributes,

        setAttributes

    ] = useState([]);

    const [

        loading,

        setLoading

    ] = useState(false);

    const fetchAttributeValues = async (

        lang = "vi"

    ) => {

        setLoading(true);

        try {

            const data =

                await getAttributeValues(
                    lang
                );

            setAttributeValues(
                data
            );

        } finally {

            setLoading(false);

        }

    };

    const fetchAttributes = async (

        lang = "vi"

    ) => {

        try {

            const data =

                await getAttributes(
                    lang
                );

            setAttributes(
                data
            );

        } catch (error) {

            console.error(error);

        }

    };

    const createNewAttributeValue =
        async (

            lang = "vi"

        ) => {

            try {

                const data =

                    await createAttributeValue(lang);

                await fetchAttributeValues(
                    lang
                );

                return data;

            } catch (error) {

                console.error(error);

                return null;

            }

        };

    const saveAttributeValueChanges =
        async (

            rows,

            lang = "vi"

        ) => {

            try {

                await saveAttributeValues(

                    rows,

                    lang

                );

                await fetchAttributeValues(
                    lang
                );

                return true;

            } catch (error) {

                console.error(error);

                return false;

            }

        };

    const deleteSelectedAttributeValues =
        async (

            ids,

            lang = "vi"

        ) => {

            try {

                const data =

                    await deleteAttributeValues(
                        ids
                    );

                await fetchAttributeValues(
                    lang
                );

                return data;

            } catch (error) {

                console.error(error);

                return null;

            }

        };

    return {

        attributeValues,

        attributes,

        loading,

        fetchAttributeValues,

        fetchAttributes,

        saveAttributeValueChanges,

        createAttributeValue:
            createNewAttributeValue,

        deleteAttributeValues:
            deleteSelectedAttributeValues

    };

}