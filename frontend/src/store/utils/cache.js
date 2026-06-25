// Cache nhẹ bằng localStorage cho dữ liệu store ít thay đổi
// (settings, menu, danh mục, brand, thuộc tính) — giúp hiện ngay khi reload
// theo kiểu stale-while-revalidate: dùng cache trước, fetch mới ngầm sau.

export function getCached(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function setCached(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* quota/private mode — bỏ qua */
    }
}
