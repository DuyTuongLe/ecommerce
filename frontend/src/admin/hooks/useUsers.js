import { useState, useCallback } from "react";
import {
    getUsers,
    createUser as createUserApi,
    updateUser as updateUserApi,
    changePassword as changePasswordApi,
    deleteUser as deleteUserApi,
    bulkDeleteUsers as bulkDeleteUsersApi,
} from "../../shared/services/userApi";

export default function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } finally {
            setLoading(false);
        }
    }, []);

    const createUser = useCallback(async (userData) => {
        const data = await createUserApi(userData);
        await fetchUsers();
        return data;
    }, [fetchUsers]);

    const updateUser = useCallback(async (id, userData) => {
        const data = await updateUserApi(id, userData);
        await fetchUsers();
        return data;
    }, [fetchUsers]);

    const changePassword = useCallback(async (id, passwordData) => {
        return await changePasswordApi(id, passwordData);
    }, []);

    const deleteUser = useCallback(async (id) => {
        const data = await deleteUserApi(id);
        await fetchUsers();
        return data;
    }, [fetchUsers]);

    const bulkDeleteUsers = useCallback(async (ids) => {
        const data = await bulkDeleteUsersApi(ids);
        await fetchUsers();
        return data;
    }, [fetchUsers]);

    return {
        users,
        loading,
        fetchUsers,
        createUser,
        updateUser,
        changePassword,
        deleteUser,
        bulkDeleteUsers,
    };
}
