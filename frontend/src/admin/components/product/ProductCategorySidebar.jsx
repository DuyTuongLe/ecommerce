// src/admin/components/product/ProductCategorySidebar.jsx

import { Input } from "antd";

function CategoryItem({

    item,
    level = 0,
    onSelect

}) {

    return (

        <div>

            <div

                onClick={() =>
                    onSelect?.(item)
                }

                style={{
                    paddingLeft: 16,
                    cursor: "pointer",
                    marginLeft: level * 16,
                }}

                className="admin-category-item"

            >

                {item.name}

            </div>

            {

                item.children?.map(
                    child => (

                        <CategoryItem

                            key={child.id}

                            item={child}

                            level={
                                level + 1
                            }

                            onSelect={
                                onSelect
                            }

                        />

                    )
                )

            }

        </div>

    );

}

export default function ProductCategorySidebar({

    categories = [],

    onSelect

}) {

    return (

        <div
            className="admin-product-sidebar"
        >

            <div
                className="admin-sidebar-header"
            >

                <h2>
                    Category / Menu
                </h2>

            </div>

            <Input
                placeholder="Search products..."
            />

            <div
                className="admin-category-tree"
            >

                {

                    categories.map(
                        item => (

                            <CategoryItem

                                key={item.id}

                                item={item}

                                onSelect={onSelect}

                            />

                        )
                    )

                }

            </div>

        </div>

    );

}