// src/admin/components/menu/ProductCategorySidebar.jsx

import {
    Input
} from "antd";

const categories = [

    {
        id: 1,
        name: "All Products"
    },

    {
        id: 2,
        name: "Laptop",

        children: [

            {
                id: 3,
                name: "Gaming Laptop"
            },

            {
                id: 4,
                name: "Ultrabook"
            }

        ]
    },

    {
        id: 5,
        name: "Điện thoại"
    },

    {
        id: 6,
        name: "Tablet"
    }

];

function CategoryItem({

    item,
    level = 0

}) {

    return (

        <div>

            <div

                style={{
                    paddingLeft: level * 16
                }}

                className="admin-category-item"

            >

                {item.name}

            </div>

            {

                item.children?.map(child => (

                    <CategoryItem

                        key={child.id}

                        item={child}

                        level={level + 1}

                    />

                ))

            }

        </div>

    );

}

export default function ProductCategorySidebar() {

    return (

        <div
            className="admin-product-sidebar"
        >

            {/* TITLE */}

            <div
                className="admin-sidebar-header"
            >

                <h2>

                    Category / Menu

                </h2>

            </div>

            {/* SEARCH */}

            <Input

                placeholder="Search products..."

                size="large"

            />

            {/* TREE */}

            <div
                className="admin-category-tree"
            >

                {

                    categories.map(item => (

                        <CategoryItem

                            key={item.id}

                            item={item}

                        />

                    ))

                }

            </div>

        </div>

    );

}