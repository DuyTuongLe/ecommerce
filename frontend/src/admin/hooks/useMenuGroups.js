// src/admin/hooks/useMenuGroups.js

import { useEffect, useState, useCallback } from "react";
import { getMenuGroups } from "../../shared/services/menuApi";

export function useMenuGroups() {

    const [groups, setGroups] = useState([]);

    const fetchGroups = useCallback(async () => {
        try {
            const data = await getMenuGroups();
            setGroups(data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    return { groups, fetchGroups };
}
