// src/admin/components/attribute/AttributeValueToolbar.jsx

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

export default function AttributeValueToolbar({

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

                    Attribute Values

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

                        Create Value

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