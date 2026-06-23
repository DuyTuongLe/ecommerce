import { useState } from "react";

import {
    getNoiDungs,
    getNoiDung,
    createNoiDung as createApi,
    updateNoiDung as updateApi,
    deleteNoiDungs as deleteApi,
    reorderNoiDungs as reorderApi,
} from "../../shared/services/noiDungApi";

export default function useNoiDung() {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchList = async (params = {}) => {
        setLoading(true);
        try {
            const data = await getNoiDungs(params);
            setItems(data);
        } finally {
            setLoading(false);
        }
    };

    const fetchOne = async (id) => {
        setLoading(true);
        try {
            return await getNoiDung(id);
        } finally {
            setLoading(false);
        }
    };

    const create = async (payload) => {
        try {
            return await createApi(payload);
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const update = async (id, payload) => {
        try {
            return await updateApi(id, payload);
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const remove = async (ids, params = {}) => {
        try {
            const data = await deleteApi(ids);
            await fetchList(params);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const reorder = async (orderedItems) => {
        try {
            return await reorderApi(orderedItems);
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    return {
        items,
        setItems,
        loading,
        fetchList,
        fetchOne,
        create,
        update,
        remove,
        reorder,
    };
}
