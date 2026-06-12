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

import {useLanguages} from "../hooks/useLanguages";

export default function ProductManager() {

    const {

        products,
        categories,

        loading,

        fetchProducts,
        fetchCategories

    } = useProducts();

    const [
        selectedCategory,
        setSelectedCategory
    ] = useState(null);

    const [

        lang,

        setLang

    ] = useState("vi");

    const languages =
        useLanguages();

    useEffect(() => {

        fetchCategories(
            lang
        );

        fetchProducts({

            lang,

            categoryId:
                selectedCategory

        });

    }, [

        lang,

        selectedCategory

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

                    categories={
                        categories
                    }

                    languages={
                        languages
                    }

                    lang={
                        lang
                    }

                    onLangChange={
                        setLang
                    }

                    onSelect={(item) => {

                        setSelectedCategory(
                            item.id
                        );

                    }}

                />

            </Splitter.Panel>

            <Splitter.Panel>

                <ProductToolbar />

                <ProductTable
                    products={
                        products?.data || []
                    }
                    loading={loading}
                />

            </Splitter.Panel>

        </Splitter>

    );

}