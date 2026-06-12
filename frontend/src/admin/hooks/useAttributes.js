// src/admin/hooks/useAttributes.js

import { useState } from "react";

import {

    getAttributes,

    saveAttributes,

    createAttribute,

    deleteAttributes

} from "../../shared/services/productApi";

export default function useAttributes() {

    const [

        attributes,

        setAttributes

    ] = useState([]);

    const [

        loading,

        setLoading

    ] = useState(false);

    const fetchAttributes = async (

        lang = "vi"

    ) => {

        setLoading(true);

        try {

            const data =

                await getAttributes(
                    lang
                );

            setAttributes(
                data
            );

        } finally {

            setLoading(false);

        }

    };

    const saveAttributeChanges = async (

        rows,

        lang = "vi"

    ) => {

        try {

            await saveAttributes(
                rows,
                lang
            );

            await fetchAttributes(
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

    const createNewAttribute = async (

        lang = "vi"

    ) => {

        try {

            const data =

                await createAttribute(
                    lang
                );

            await fetchAttributes(
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

    const deleteSelectedAttributes = async (

        ids,

        lang = "vi"

    ) => {

        try {

            const data =

                await deleteAttributes(
                    ids
                );

            await fetchAttributes(
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

        attributes,

        loading,

        fetchAttributes,

        saveAttributeChanges,

        createAttribute:
            createNewAttribute,

        deleteAttributes:
            deleteSelectedAttributes

    };

}