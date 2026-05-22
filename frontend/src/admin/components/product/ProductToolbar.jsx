// src/admin/components/product/ProductToolbar.jsx

import {

    Input,
    Button,
    Select,
    Space

} from "antd";

import {

    PlusOutlined

} from "@ant-design/icons";

export default function ProductToolbar() {

    return (
        <div

            style={{
                padding: 10,
            }}

        >

            <div className="admin-sidebar-header">
                <h2>Products</h2>
            </div>
            <div

                style={{

                    display: "flex",

                    justifyContent: "space-between",

                    alignItems: "center",

                    marginBottom: 20

                }}

            >

                {/* LEFT */}

                <Space>

                    <Select

                        defaultValue="all"

                        style={{
                            width: 180
                        }}

                        options={[

                            {
                                label: "All Status",
                                value: "all"
                            },

                            {
                                label: "Published",
                                value: "published"
                            },

                            {
                                label: "Draft",
                                value: "draft"
                            }

                        ]}

                    />

                </Space>

                {/* RIGHT */}

                <Button

                    type="primary"

                    icon={<PlusOutlined />}

                >

                    Create Product

                </Button>

            </div>
        </div>

    );

}