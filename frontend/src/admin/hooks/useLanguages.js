// src/admin/hooks/useLanguages.js

import { useEffect, useState } from "react";
import { getLanguages } from "../../shared/services/menuApi";

// Module-level cache: tất cả component dùng useLanguages() chia sẻ cùng một
// kết quả. Tránh N request song song khi nhiều trang mount cùng lúc.
let cached = null;
let pending = null;

function fetchOnce() {
    if (cached) {
        return Promise.resolve(cached);
    }
    if (!pending) {
        pending = getLanguages()
            .then((data) => {
                cached = data;
                pending = null;
                return data;
            })
            .catch((err) => {
                pending = null;
                throw err;
            });
    }
    return pending;
}

// Cho phép invalidate từ bên ngoài (vd: sau khi thêm/sửa ngôn ngữ).
export function invalidateLanguagesCache() {
    cached = null;
    pending = null;
}

export function useLanguages() {

    const [languages, setLanguages] = useState(cached || []);

    useEffect(() => {
        let cancelled = false;

        fetchOnce()
            .then((data) => {
                if (!cancelled) {
                    setLanguages(data);
                }
            })
            .catch((error) => {
                console.error(error);
            });

        return () => { cancelled = true; };
    }, []);

    return languages;
}
