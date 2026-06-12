// src/admin/components/brand/BrandTable.jsx

import {
    Table,
    Input,
    Select,
    Avatar
} from "antd";

export default function BrandTable({

    brands = [],

    loading,

    selectedRowKeys,
    setSelectedRowKeys,

    editedRows,
    setEditedRows,

    onSelectLogo,

    newBrandId

}) {

    const columns = [

        {

            title: "ID",

            dataIndex: "id",

            width: 60

        },

        {

            title: "Logo",

            dataIndex: "logo",

            width: 100,

            className: "brand-image",

            render: (value, record) => {

                const logo =

                    editedRows[
                        record.id
                    ]?.logo

                    ??

                    value;

                return (

                    <Avatar

                        shape="square"

                        size={80}

                        src={logo}

                        style={{
                            cursor: "pointer"
                        }}

                        onClick={() => {

                            onSelectLogo?.(
                                record
                            );

                        }}

                    >

                        {record.name?.charAt(0)}

                    </Avatar>

                );

            }

        },

        {

            title: "Brand Name",

            dataIndex: "name",

            render: (

                value,

                record

            ) => (

                <Input

                    autoFocus={
                        record.id ===
                        newBrandId
                    }

                    value={

                        editedRows[
                            record.id
                        ]?.name

                        ??

                        value

                    }

                    onChange={(e) => {

                        setEditedRows(
                            prev => ({

                                ...prev,

                                [record.id]: {

                                    ...record,

                                    ...prev[
                                        record.id
                                    ],

                                    name:
                                        e.target.value

                                }

                            })
                        );

                    }}

                />

            )

        },

        {

            title: "Status",

            dataIndex: "status",

            width: 180,

            render: (

                value,

                record

            ) => (

                <Select

                    style={{
                        width: "100%"
                    }}

                    value={

                        editedRows[
                            record.id
                        ]?.status

                        ??

                        value

                    }

                    options={[

                        {

                            label:
                                "Published",

                            value: 1

                        },

                        {

                            label:
                                "Draft",

                            value: 0

                        }

                    ]}

                    onChange={(status) => {

                        setEditedRows(
                            prev => ({

                                ...prev,

                                [record.id]: {

                                    ...record,

                                    ...prev[
                                        record.id
                                    ],

                                    status

                                }

                            })
                        );

                    }}

                />

            )

        }

    ];

    return (

        <Table

            rowKey="id"

            loading={loading}

            dataSource={brands}

            columns={columns}

            pagination={false}

            rowSelection={{

                selectedRowKeys,

                onChange:
                    setSelectedRowKeys

            }}

            rowClassName={(record) => {

                return record.id === newBrandId

                    ? "new-brand-row"

                    : "";

            }}

        />

    );

}