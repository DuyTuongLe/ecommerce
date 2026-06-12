// src/admin/components/attribute/AttributeValueTable.jsx

import {

    Table,
    Input,
    Select

} from "antd";

export default function AttributeValueTable({

    attributeValues = [],

    attributes = [],

    loading,

    selectedRowKeys,

    setSelectedRowKeys,

    editedRows,

    setEditedRows,

    newAttributeValueId

}) {

    const columns = [

        {

            title: "ID",

            dataIndex: "id",

            width: 60

        },

        {

            title: "Attribute",

            dataIndex: "attribute_id",

            width: 200,

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
                        ]?.attribute_id

                        ??

                        value

                    }

                    options={

                        attributes.map(
                            item => ({

                                label:
                                    item.name,

                                value:
                                    item.id

                            })
                        )

                    }

                    onChange={(attribute_id) => {

                        setEditedRows(
                            prev => ({

                                ...prev,

                                [record.id]: {

                                    ...record,

                                    ...prev[
                                    record.id
                                    ],

                                    attribute_id

                                }

                            })
                        );

                    }}

                />

            )

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

                        newAttributeValueId

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

            title: "Color",

            dataIndex: "color_code",

            width: 140,

            render: (

                value,

                record

            ) => (

                <Input

                    placeholder="#000000"

                    value={

                        editedRows[
                            record.id
                        ]?.color_code

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

                                    color_code:
                                        e.target.value

                                }

                            })
                        );

                    }}

                />

            )

        },

        {

            title: "Sort",

            dataIndex: "thutu",

            width: 80,

            render: (

                value,

                record

            ) => (

                <Input

                    value={

                        editedRows[
                            record.id
                        ]?.thutu

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

                                    thutu:
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

            dataSource={
                attributeValues
            }

            pagination={false}

            columns={columns}
            
            rowSelection={{

                selectedRowKeys,

                onChange:
                    setSelectedRowKeys

            }}

            rowClassName={(record) => {

                return record.id === newAttributeValueId

                    ? "new-brand-row"

                    : "";

            }}

        />

    );

}