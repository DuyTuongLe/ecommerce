// src/admin/components/product/ProductTable.jsx

import {
    Table,
    Tag,
    Image
} from "antd";


export default function ProductTable({

    products = [],

    loading = false,

    selectedRowKeys = [],

    onSelectionChange

}) {
    const rowSelection = {

        selectedRowKeys,

        onChange:

            onSelectionChange

    };
    const columns = [

        {
            title: "Image",

            dataIndex: "thumbnail",

            width: 100,

            render: (value) => (

                <Image
                    width={60}
                    height={60}
                    src={value}
                    style={{
                        objectFit: "cover",
                        borderRadius: 8
                    }}
                />

            )
        },

        {
            title: "Product Name",

            dataIndex: "name"
        },

        {
            title: "SKU",

            dataIndex: "sku",

            width: 140
        },

        {
            title: "Price",

            width: 180,

            render: (_, record) => {

                if (record.sale_price) {

                    return (
                        <>
                            <div
                                style={{
                                    textDecoration:
                                        "line-through",
                                    color: "#999"
                                }}
                            >
                                {Number(
                                    record.price
                                ).toLocaleString()}đ
                            </div>

                            <div>
                                {Number(
                                    record.sale_price
                                ).toLocaleString()}đ
                            </div>
                        </>
                    );
                }

                return (
                    <>
                        {Number(
                            record.price
                        ).toLocaleString()}đ
                    </>
                );
            }
        },

        {
            title: "Status",

            dataIndex: "status",

            width: 120,

            render: (value) => (

                value
                    ? (
                        <Tag color="green">
                            Published
                        </Tag>
                    )
                    : (
                        <Tag color="orange">
                            Draft
                        </Tag>
                    )

            )
        }
    ];

    return (

        <Table

            rowKey="id"

            rowSelection={
                rowSelection
            }

            columns={columns}

            dataSource={products}

            loading={loading}

            pagination={false}

        />

    );
}