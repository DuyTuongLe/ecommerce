// src/admin/components/product/ProductTable.jsx

import {

    Table,
    Tag,
    Image

} from "antd";

const data = [

    {

        id: 1,

        image:
            "https://placehold.co/80x80",

        name:
            "Macbook Pro M4",

        sku:
            "MBP-M4",

        price:
            "45.000.000đ",

        status: 1

    },

    {

        id: 2,

        image:
            "https://placehold.co/80x80",

        name:
            "Asus ROG",

        sku:
            "ROG-2026",

        price:
            "39.000.000đ",

        status: 0

    }

];

export default function ProductTable() {

    const columns = [

        {

            title: "Image",

            dataIndex: "image",

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

            dataIndex: "price",

            width: 160

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

            columns={columns}

            dataSource={data}

            pagination={false}

        />

    );

}