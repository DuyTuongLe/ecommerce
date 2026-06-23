// src/admin/pages/ProductManager.jsx

import { useEffect, useState, useCallback, useRef } from "react";

import { Splitter } from "antd";

import ProductCategorySidebar
    from "../components/product/ProductCategorySidebar";

import ProductToolbar
    from "../components/product/ProductToolbar";

import ProductTable
    from "../components/product/ProductTable";

import useProducts
    from "../hooks/useProducts";

import { useLanguages } from "../hooks/useLanguages";

export default function ProductManager() {

    const {
        products,
        categories,
        loading,
        fetchProducts,
        fetchCategories,
        publishProducts,
        unpublishProducts,
        removeProducts
    } = useProducts();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [status, setStatus] = useState(null);
    const [lang, setLang] = useState("vi");
    const [search, setSearch] = useState("");
    const languages = useLanguages();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    // Ref giữ giá trị hiện tại để các callback không phải là dependency
    const filtersRef = useRef({ lang, selectedCategory, status, search });
    filtersRef.current = { lang, selectedCategory, status, search };

    const reload = useCallback(() => {
        const { lang, selectedCategory, status, search } = filtersRef.current;
        fetchProducts({ lang, categoryId: selectedCategory, status, search });
    }, [fetchProducts]);

    const handleSearch = useCallback((value) => {
        setSelectedCategory(null);
        setSearch(value);
    }, []);

    const handleSelectCategory = useCallback((item) => {
        setSelectedCategory(item?.id ?? null);
        setSearch("");
    }, []);

    useEffect(() => {
        fetchCategories(lang);
    }, [lang, fetchCategories]);

    useEffect(() => {
        fetchProducts({
            lang,
            categoryId: selectedCategory,
            status,
            search
        });
    }, [lang, selectedCategory, status, search, fetchProducts]);

    const handlePublish = useCallback(async () => {
        await publishProducts(selectedRowKeys);
        reload();
        setSelectedRowKeys([]);
    }, [selectedRowKeys, publishProducts, reload]);

    const handleUnpublish = useCallback(async () => {
        await unpublishProducts(selectedRowKeys);
        reload();
        setSelectedRowKeys([]);
    }, [selectedRowKeys, unpublishProducts, reload]);

    const handleDelete = useCallback(async () => {
        await removeProducts(selectedRowKeys);
        setSelectedRowKeys([]);
        reload();
    }, [selectedRowKeys, removeProducts, reload]);

    const handleReload = useCallback(() => {
        reload();
        setSelectedRowKeys([]);
    }, [reload]);

    return (

        <Splitter
            style={{ height: "100%" }}
        >

            <Splitter.Panel
                defaultSize={220}
                min={180}
                max={350}
            >

                <ProductCategorySidebar
                    categories={categories}
                    languages={languages}
                    lang={lang}
                    onLangChange={setLang}
                    selectedCategory={selectedCategory}
                    onSelect={handleSelectCategory}
                    searchKeyword={search}
                    onSearch={handleSearch}
                />

            </Splitter.Panel>

            <Splitter.Panel>

                <ProductToolbar
                    lang={lang}
                    status={status}
                    onStatusChange={setStatus}
                    selectedRowKeys={selectedRowKeys}
                    onReload={handleReload}
                    onPublish={handlePublish}
                    onUnpublish={handleUnpublish}
                    onDelete={handleDelete}
                />

                <ProductTable
                    products={products?.data || []}
                    loading={loading}
                    selectedRowKeys={selectedRowKeys}
                    onSelectionChange={setSelectedRowKeys}
                />

            </Splitter.Panel>

        </Splitter>

    );
}
