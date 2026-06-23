// src/admin/hooks/useProductOptions.js

import { useEffect, useState, useRef } from "react";
import { getProductFormOptions } from "../../shared/services/productApi";

const EMPTY = { brands: [], categories: [], attributes: [] };

// Module-level cache keyed by lang — options đổi ít, tránh fetch lại mỗi lần
// chuyển locale rồi quay lại.
const cache = {};

export default function useProductOptions(lang) {

    const [options, setOptions] = useState(cache[lang] || EMPTY);
    const abortRef = useRef(null);

    useEffect(() => {
        if (cache[lang]) {
            setOptions(cache[lang]);
            return;
        }

        let cancelled = false;

        async function load() {
            const data = await getProductFormOptions(lang);
            if (!cancelled) {
                cache[lang] = data;
                setOptions(data);
            }
        }

        load().catch((err) => {
            if (!cancelled) console.error(err);
        });

        return () => { cancelled = true; };
    }, [lang]);

    return options;
}
