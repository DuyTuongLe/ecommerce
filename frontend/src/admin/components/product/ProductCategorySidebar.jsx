// src/admin/components/product/ProductCategorySidebar.jsx

import { useEffect, useRef, useState } from "react";
import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

function CategoryItem({ item, level = 0, selectedId, onSelect }) {
    const active = item.id === selectedId;

    return (
        <>
            <div
                onClick={() => onSelect?.(item)}
                className={
                    "admin-category-item"
                    + (active ? " admin-category-item--active" : "")
                }
                style={{ marginLeft: level * 16 }}
            >
                {item.name}
            </div>

            {item.children?.map((child) => (
                <CategoryItem
                    key={child.id}
                    item={child}
                    level={level + 1}
                    selectedId={selectedId}
                    onSelect={onSelect}
                />
            ))}
        </>
    );
}

const DEBOUNCE_MS = 350;

export default function ProductCategorySidebar({
    categories = [],
    languages = [],
    lang,
    onLangChange,
    selectedCategory,
    onSelect,
    searchKeyword,
    onSearch,
}) {
    const [draft, setDraft] = useState(searchKeyword || "");
    const timerRef = useRef(null);

    useEffect(() => {
        setDraft(searchKeyword || "");
    }, [searchKeyword]);

    const handleChange = (value) => {
        setDraft(value);

        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onSearch(value);
        }, DEBOUNCE_MS);
    };

    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    return (
        <div className="admin-product-sidebar">
            <div className="admin-sidebar-header-language">
                <span
                    className={
                        "language-label"
                        + (!selectedCategory ? " language-label--active" : "")
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => onSelect?.(null)}
                >
                    Products
                </span>

                <Select
                    value={lang}
                    onChange={onLangChange}
                    options={languages.map((item) => ({
                        label: item.name,
                        value: item.code,
                    }))}
                />
            </div>

            <div className="admin-sidebar-input">
                <Input
                    value={draft}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="Search products..."
                    prefix={<SearchOutlined style={{ color: "#bbb" }} />}
                    allowClear
                />
            </div>

            <div className="admin-category-tree">
                {categories.map((item) => (
                    <CategoryItem
                        key={item.id}
                        item={item}
                        selectedId={selectedCategory}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </div>
    );
}
