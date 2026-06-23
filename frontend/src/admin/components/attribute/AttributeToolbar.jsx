// src/admin/components/brand/BrandToolbar.jsx

import {

        Button,
    Space,
    Select,
    message,
    Modal

} from "antd";

import {

    PlusOutlined,
    ReloadOutlined,
    DeleteOutlined,
    SaveOutlined

} from "@ant-design/icons";

export default function AttributeToolbar({

    languages = [],

    lang,

    onLangChange,

    editedRows = {},

    selectedRowKeys = [],

    onReload,

    onSave,

    onCreate,

    onDelete

}) {

    const changedCount =
        Object.keys(
            editedRows
        ).length;

    return (

        <div>

            <div className="admin-sidebar-header">

                <h2>

                    Attributes

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

                        Create Attribute

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

                            const success =

                                await onSave?.();

                            if (success === true) {

                                message.success(
                                    "Saved successfully"
                                );

                            }

                            if (success === false) {

                                message.error(
                                    "Save failed"
                                );

                            }

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

                        onClick={() => {
                            Modal.confirm({
                                title: "Delete Attributes?",
                                content: `Are you sure you want to delete ${selectedRowKeys.length} selected attribute(s)?`,
                                okType: "danger",
                                onOk: onDelete,
                            });
                        }}

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