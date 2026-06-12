// src/admin/components/brand/BrandToolbar.jsx

import {

    Button,
    Space,
    Select,
    message

} from "antd";

import {

    PlusOutlined,
    ReloadOutlined,
    DeleteOutlined,
    SaveOutlined

} from "@ant-design/icons";

export default function BrandToolbar({

    languages = [],

    lang,

    onLangChange,

    editedRows = {},

    selectedRowKeys = [],

    onReload,

    onSave,

    onCreate,

    onDelete,

}) {

    const changedCount =
        Object.keys(
            editedRows
        ).length;

    return (

        <div>

            <div className="admin-sidebar-header">

                <h2>

                    Brands

                </h2>

            </div>

            <div
                style={{
                    padding: 16
                }}
            >

                <Space wrap>

                    <Select

                        value={lang}

                        onChange={onLangChange}

                        style={{
                            width: 140
                        }}

                        options={
                            languages.map(item => ({

                                label: item.name,

                                value: item.code

                            }))
                        }

                    />

                    <Button

                        icon={
                            <ReloadOutlined />
                        }

                        onClick={
                            onReload
                        }

                    >

                        Reload

                    </Button>

                    <Button

                        type="primary"

                        icon={
                            <PlusOutlined />
                        }

                        onClick={
                            onCreate
                        }

                    >

                        Create Brand

                    </Button>

                    <Button

                        type="primary"

                        icon={
                            <SaveOutlined />
                        }

                        disabled={
                            changedCount === 0
                        }

                        onClick={async () => {

                            await onSave?.();

                            message.success(
                                "Saved successfully"
                            );

                        }}

                    >

                        Save Changes

                        {

                            changedCount > 0

                                ? ` (${changedCount})`

                                : ""

                        }

                    </Button>

                    <Button

                        danger

                        icon={
                            <DeleteOutlined />
                        }

                        disabled={
                            selectedRowKeys.length === 0
                        }

                        onClick={
                            onDelete
                        }

                    >

                        Delete

                        {

                            selectedRowKeys.length > 0

                                ? ` (${selectedRowKeys.length})`

                                : ""

                        }

                    </Button>

                </Space>

            </div>

        </div>

    );

}