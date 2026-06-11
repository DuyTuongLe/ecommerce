// src/admin/components/attribute/AttributeTable.jsx

import {
    Table,
    Input,
    Select
} from "antd";

export default function AttributeTable({

    attributes = [],

    loading,

    selectedRowKeys,
    setSelectedRowKeys,

    editedRows,
    setEditedRows,

    newAttributeId

}) {

    const columns = [

        {

            title: "ID",

            dataIndex: "id",

            width: 80

        },

        {

            title: "Name",

            dataIndex: "name",

            render: (

                value,

                record

            ) => (

                <Input

                    autoFocus={

                        record.id ===

                        newAttributeId

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

            title: "Code",

            dataIndex: "code",

            width: 200,

            render: (value) => (

    <Input

        value={value}

        disabled

    />

)

        },

        {

            title: "Type",

            dataIndex: "type",

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
                        ]?.type

                        ??

                        value

                    }

                    options={[

                        {

                            label:
                                "Select",

                            value:
                                "select"

                        },

                        {

                            label:
                                "Color",

                            value:
                                "color"

                        }

                    ]}

                    onChange={(type) => {

                        setEditedRows(
                            prev => ({

                                ...prev,

                                [record.id]: {

                                    ...record,

                                    ...prev[
                                    record.id
                                    ],

                                    type

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

            width: 150,

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

            dataSource={attributes}

            pagination={false}

            columns={columns}

            rowSelection={{

                selectedRowKeys,

                onChange:
                    setSelectedRowKeys

            }}

            rowClassName={(record) => {

                return record.id === newAttributeId

                    ? "new-brand-row"

                    : "";

            }}

        />

    );

}