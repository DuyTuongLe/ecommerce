// src/admin/components/product/ProductToolbar.jsx

import {

    Button,
    Select,
    Space,
    Modal

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
    selectedRowKeys = [],
    onReload,
    onPublish,
    onUnpublish,
    onDelete
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

                        onClick={onReload}

                    >

                        Reload

                    </Button>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {

                            navigate(
                                `/admin/products/create?lang=${lang}`
                            );

                        }}
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

                        disabled={
                            selectedRowKeys.length === 0
                        }

                        icon={

                            <CheckCircleOutlined
                                style={{
                                    color: "#52c41a"
                                }}
                            />

                        }

                        onClick={onPublish}

                    >

                        Publish

                    </Button>

                    <Button

                        disabled={
                            selectedRowKeys.length === 0
                        }

                        icon={

                            <StopOutlined
                                style={{
                                    color: "#ff4d4f"
                                }}
                            />

                        }

                        onClick={onUnpublish}

                    >

                        Unpublish

                    </Button>

                    <Button

                        danger

                        disabled={
                            selectedRowKeys.length === 0
                        }

                        icon={<DeleteOutlined />}

                        onClick={() => {

                            Modal.confirm({

                                title:
                                    "Delete products?",

                                content:

                                    `Delete ${selectedRowKeys.length} selected products?`,

                                okType:
                                    "danger",

                                onOk:
                                    onDelete

                            });

                        }}

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