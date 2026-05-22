// src/admin/pages/ProductManager.jsx

import {

    Splitter

} from "antd";

import ProductCategorySidebar
    from "../components/menu/ProductCategorySidebar";

import ProductToolbar
    from "../components/product/ProductToolbar";

import ProductTable
    from "../components/product/ProductTable";

export default function ProductManager() {

    return (

        <Splitter
            style={{
                height: "100%"
            }}
        >

            {/* LEFT */}

            <Splitter.Panel

                defaultSize={220}

                min={180}

                max={350}

            >

                <ProductCategorySidebar />

            </Splitter.Panel>

            {/* RIGHT */}

            <Splitter.Panel>

                    <ProductToolbar />

                    <ProductTable />

            </Splitter.Panel>

        </Splitter>

    );

}