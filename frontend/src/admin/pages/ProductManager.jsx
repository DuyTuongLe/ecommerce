// src/admin/pages/ProductManager.jsx

import { useEffect, useState } from "react";

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

    const [
        selectedCategory,
        setSelectedCategory
    ] = useState(null);

    const [
        status,
        setStatus
    ] = useState(null);

    const [

        lang,

        setLang

    ] = useState("vi");

    const [
        search,
        setSearch
    ] = useState("");

    const languages = useLanguages();

    const [

        selectedRowKeys,

        setSelectedRowKeys

    ] = useState([]);

    const handleSearch = (value) => {

        setSelectedCategory(null);

        setSearch(value);

    };

    useEffect(() => {

        fetchCategories(
            lang
        );

        fetchProducts({

            lang,

            categoryId:
                selectedCategory,

            status,

            search

        });

    }, [

        lang,

        selectedCategory,

        status,

        search

    ]);

    return (

        <Splitter
            style={{
                height: "100%"
            }}
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

                    onSelect={(item) => {

                        setSelectedCategory(
                            item.id
                        );

                        setSearch("");

                    }}

                    searchKeyword={search}

                    onSearch={handleSearch}

                />

            </Splitter.Panel>

            <Splitter.Panel>

                <ProductToolbar
                    lang={lang}

                    status={status}

                    onStatusChange={
                        setStatus
                    }

                    selectedRowKeys={
                        selectedRowKeys
                    }

                    onReload={() => {

                        fetchProducts({

                            lang,

                            categoryId:
                                selectedCategory,

                            status,

                            search

                        });

                        setSelectedRowKeys([]);

                    }}
                    onPublish={async () => {

                        await publishProducts(
                            selectedRowKeys
                        );

                        fetchProducts({

                            lang,

                            categoryId:
                                selectedCategory,

                            status,

                            search

                        });

                        setSelectedRowKeys([]);

                    }}

                    onUnpublish={async () => {

                        await unpublishProducts(
                            selectedRowKeys
                        );

                        fetchProducts({

                            lang,

                            categoryId:
                                selectedCategory,

                            status,

                            search

                        });

                        setSelectedRowKeys([]);

                    }}

                    onDelete={async () => {

                        await removeProducts(
                            selectedRowKeys
                        );

                        setSelectedRowKeys([]);

                        fetchProducts({

                            lang,

                            categoryId:
                                selectedCategory,

                            status,

                            search

                        });

                    }}
                />

                <ProductTable
                    products={
                        products?.data || []
                    }

                    loading={loading}

                    selectedRowKeys={
                        selectedRowKeys
                    }

                    onSelectionChange={
                        setSelectedRowKeys
                    }
                />

            </Splitter.Panel>

        </Splitter>

    );

}