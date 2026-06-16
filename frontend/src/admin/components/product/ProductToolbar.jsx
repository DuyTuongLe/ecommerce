// src/admin/components/product/ProductToolbar.jsx

import {

    Button,
    Select,
    Space

} from "antd";

import {

    PlusOutlined,
    ReloadOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    StopOutlined,
    AppstoreOutlined

} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

export default function ProductToolbar({
    lang = "vi",
    selectedRowKeys = []
}) {

    const navigate = useNavigate();

    return (

        <div>

            <div
                className="admin-sidebar-header"
            >

                <h2
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        margin: 0
                    }}
                >

                    <AppstoreOutlined />

                    Products

                </h2>

            </div>
            <div

                style={{

                    display: "flex",

                    justifyContent:
                        "space-between",

                    alignItems:
                        "center",

                    padding: "10px 16px 16px"

                }}

            >

                <div

                    style={{

                        display: "flex",

                        flexWrap: "wrap",

                        gap: 8

                    }}

                >

                    <Button
                        icon={<ReloadOutlined />}
                    >
                        Reload
                    </Button>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                    >
                        Create
                    </Button>

                    <Button

                        icon={<EditOutlined />}

                        disabled={
                            selectedRowKeys.length !== 1
                        }

                        onClick={() => {

                            navigate(

                                `/admin/products/${selectedRowKeys[0]}/edit?lang=${lang}`

                            );

                        }}

                    >

                        Edit

                    </Button>

                    <Button
                        icon={<CheckCircleOutlined style={{
                            color: "#52c41a"
                        }}
                        />}
                    >
                        Publish
                    </Button>

                    <Button
                        icon={<StopOutlined
                            style={{
                                color: "#ff4d4f"
                            }}
                        />}
                    >
                        Unpublish
                    </Button>

                    <Button
                        danger
                        icon={<DeleteOutlined />}
                    >
                        Delete
                    </Button>

                    <Select
                        defaultValue="all"
                        style={{
                            width: 140
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

                </div>

            </div>

        </div>

    );

}