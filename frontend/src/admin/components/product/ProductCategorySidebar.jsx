// src/admin/components/product/ProductCategorySidebar.jsx

import { Input, Select } from "antd";

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

    languages = [],

    lang,

    onLangChange,

    onSelect,

    searchKeyword,

    onSearch

}) {

    return (

        <div
            className="admin-product-sidebar"
        >

            <div className="admin-sidebar-header-language">
                
                <span className="language-label">🌐 Language</span>

                <Select

                    value={lang}

                    onChange={onLangChange}

                    options={
                        languages.map(item => ({

                            label:
                                item.name,

                            value:
                                item.code

                        }))
                    }

                />

            </div>

            <div className="admin-sidebar-input">
                <Input

    value={searchKeyword}

    onChange={(e) =>
        onSearch(
            e.target.value
        )
    }

    placeholder="Search products..."

/>
            </div>

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