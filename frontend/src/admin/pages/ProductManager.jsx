// src/admin/pages/ProductManager.jsx

import { useEffect } from "react";

import { Splitter } from "antd";

import ProductCategorySidebar
    from "../components/product/ProductCategorySidebar";

import ProductToolbar
    from "../components/product/ProductToolbar";

import ProductTable
    from "../components/product/ProductTable";

import useProducts
    from "../hooks/useProducts";

export default function ProductManager() {

    const {

        products,
        loading,
        fetchProducts

    } = useProducts();

    useEffect(() => {

        fetchProducts();

    }, []);

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

                <ProductCategorySidebar />

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