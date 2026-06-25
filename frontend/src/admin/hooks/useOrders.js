import { useState, useCallback } from "react";
import {
    getOrders,
    getOrder,
    updateOrderStatus as updateStatusApi,
    deleteOrder as deleteOrderApi,
    bulkDeleteOrders as bulkDeleteApi,
} from "../../shared/services/orderApi";

export default function useOrders() {
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const fetchOrders = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const data = await getOrders(params);
            setOrders(data);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDetail = useCallback(async (id) => {
        setDetailLoading(true);
        try {
            const data = await getOrder(id);
            setDetail(data);
            return data;
        } finally {
            setDetailLoading(false);
        }
    }, []);

    const updateStatus = useCallback(async (id, payload) => {
        try {
            const data = await updateStatusApi(id, payload);
            if (data.order) setDetail(data.order);
            return data;
        } catch (e) {
            return null;
        }
    }, []);

    const removeOrder = useCallback(async (id) => {
        try {
            return await deleteOrderApi(id);
        } catch (e) {
            return null;
        }
    }, []);

    const bulkRemove = useCallback(async (ids) => {
        try {
            return await bulkDeleteApi(ids);
        } catch (e) {
            return null;
        }
    }, []);

    return {
        orders,
        loading,
        detail,
        detailLoading,
        fetchOrders,
        fetchDetail,
        updateStatus,
        removeOrder,
        bulkRemove,
        setDetail,
    };
}
